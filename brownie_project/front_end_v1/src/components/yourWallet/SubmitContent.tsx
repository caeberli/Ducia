import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core"
import { Token } from "../Main"
import { formatUnits } from "@ethersproject/units"
import { Button, Input, CircularProgress, Snackbar } from "@material-ui/core"
import React, { ReactText, useState, useEffect } from "react"
import { usePostTokens } from "../../hooks/usePostTokens"
import { utils } from "ethers"
import Alert from "@material-ui/lab/Alert"
import { create } from 'ipfs-http-client'



export interface SubmitContentProps {
    token: Token
}


const client = create()

export const SubmitContent = ({ token }: SubmitContentProps) => {


    const { image, address, name } = token
    const { account } = useEthers()

    const tokenBalance = useTokenBalance(address, account)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0

    const { notifications } = useNotifications()


    const [content, setContent] = useState<string>("Enter Content Here")

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newContent = event.target.value === "" ? "" : String(event.target.value)
        setContent(newContent)
        console.log(newContent)
    }

    const { approve, state: approveERC20state } = usePostTokens(address)

    const handlePostSubmit = () => {
        const post_content = content
        const one = 1
        const one_as_wei = utils.parseEther(one.toString())

        //here we do all the IPFS stuff and then have post_content only be the ipfs url

        return approve(one_as_wei.toString(), post_content)
    }

    const isMining = approveERC20state.status === "Mining"
    const [showErc20Success, setShowErc20Success] = useState(false)
    const [showPostSuccess, setShowPostSuccess] = useState(false)
    const handleCloseSnack = () => {
        setShowErc20Success(false)
        setShowPostSuccess(false)
    }

    useEffect(() => {
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Approve ERC20 transfer").length > 0) {
            setShowErc20Success(true)
            setShowPostSuccess(false)
        }
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Submit Content"
        ).length > 0) {
            setShowErc20Success(false)
            setShowPostSuccess(true)
        }
    }, [notifications, setShowErc20Success, setShowPostSuccess])

    return (
        <>
            <div>
                <Input
                    onChange={handleInputChange} />
                <Button
                    onClick={handlePostSubmit}
                    color="primary"
                    size="large"
                    disabled={isMining}>
                    {isMining ? <CircularProgress size={26} /> : "Submit Content!"}
                </Button>
            </div>
            <Snackbar
                open={showErc20Success}
                autoHideDuration={5000}
                onClose={handleCloseSnack}
            >
                <Alert onClose={handleCloseSnack} severity="success">
                    Post token transfer approved! Now approve the 2nd transaction to put content on chain.
                </Alert>
            </Snackbar>
            <Snackbar
                open={showPostSuccess}
                autoHideDuration={5000}
                onClose={handleCloseSnack}>
                <Alert onClose={handleCloseSnack} severity="success">
                    Content Submitted!
                </Alert>
            </Snackbar>

        </>
    )


}