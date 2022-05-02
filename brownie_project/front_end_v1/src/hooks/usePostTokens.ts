import { useEthers, useContractFunction } from "@usedapp/core"
import Ducia_v1 from "../chain-info/contracts/Ducia_v1.json"
import ERC20 from "../chain-info/contracts/dependencies/OpenZeppelin/openzeppelin-contracts@4.5.0/ERC20.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants, utils } from "ethers"
import { connectContractToSigner } from "@usedapp/core/dist/esm/src/hooks"
import { Contract } from "@ethersproject/contracts"
import { useEffect, useState } from "react"

//this will always be post token for us so we can not pass any parameter and simply define it locally
//we then wanna export a function whch we can call in submit content that only need the string content and then will do the approve (from ERC20) and submit content (from Ducia) here locally

export const usePostTokens = (tokenAddress: string) => {

    const { chainId } = useEthers()

    const Ducia_v1_abi = Ducia_v1.abi
    const Ducia_v1_address = chainId ? networkMapping[String(chainId)]["Ducia_v1"][0] : constants.AddressZero
    const Ducia_v1_Interface = new utils.Interface(Ducia_v1_abi)
    const Ducia_v1_Contract = new Contract(Ducia_v1_address, Ducia_v1_Interface)


    const erc20ABI = ERC20.abi
    const erc20Interface = new utils.Interface(erc20ABI)
    const erc20Contract = new Contract(tokenAddress, erc20Interface)


    const { send: approveERC20send, state: approveERC20state } =
        useContractFunction(erc20Contract, "approve", {
            transactionName: "Approve ERC20 transfer",
        })

    //problem right now that we have the same amount as content ID and how much to pay
    const approve = (amount: string, contentId: string) => {
        setContentId(contentId)
        return approveERC20send(Ducia_v1_address, amount)
    }

    const { send: submitPost, state: submitPostState } =
        useContractFunction(Ducia_v1_Contract, "submit_content", {
            transactionName: "Submit Content",
        })


    const [contendId, setContentId] = useState("0")

    useEffect(() => {
        if (approveERC20state.status === "Success") {
            submitPost(contendId)
        }
    }, [approveERC20state, contendId])

    const [state, setState] = useState(approveERC20state)

    useEffect(() => {
        if (approveERC20state.status === "Success") {
            setState(submitPostState)
        } else {
            setState(approveERC20state)
        }
    }, [submitPostState, approveERC20state])

    return { approve, state }



}