import { useEthers } from "@usedapp/core"
import helperConfig from "../helper-config.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants } from "ethers"
import brownieConfig from "../brownie-config.json"
import DRT from "../DRT.png"
import DPT from "../DPT.png"
import { YourWallet } from "./yourWallet/YourWallet"
import { makeStyles } from "@material-ui/core"

export type Token = {
    image: string
    address: string
    name: string
}

const useStyles = makeStyles((theme) => ({
    title: {
        color: theme.palette.common.white,
        textAlign: "center",
        padding: theme.spacing(4)
    }
}))

export const Main = () => {


    const classes = useStyles()
    const { chainId } = useEthers()
    const networkName = chainId ? helperConfig[chainId] : "dev"

    //console.log(chainId)
    //console.log(networkName)

    const RepToken_address = chainId ? networkMapping[String(chainId)]["RepToken"][0] : constants.AddressZero
    const PostToken_address = chainId ? networkMapping[String(chainId)]["PostToken"][0] : constants.AddressZero
    const Ducia_v1_address = chainId ? networkMapping[String(chainId)]["Ducia_v1"][0] : constants.AddressZero

    const supportedTokens: Array<Token> = [
        {
            image: DRT,
            address: RepToken_address,
            name: "DRT"
        },
        {
            image: DPT,
            address: PostToken_address,
            name: "DPT"
        }
    ]


    return (<>
        <h1 className={classes.title}>Ducia Beta Version</h1>
        <YourWallet supportedTokens={supportedTokens} />
    </>)

}