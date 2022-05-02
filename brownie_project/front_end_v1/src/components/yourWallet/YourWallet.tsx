import { Token } from "../Main"
import React, { useState } from "react"
import { Box } from "@material-ui/core"
import { WalletBalance } from "./WalletBalance"
import { SubmitContent } from "./SubmitContent"
import { ValidateContent } from "./ValidateContent"

interface YourWalletProps {
    supportedTokens: Array<Token>
}

export const YourWallet = ({ supportedTokens }: YourWalletProps) => {

    const DRT_index = 0
    const DPT_index = 1

    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)
    //console.log("Should be 0", selectedTokenIndex)

    return (
        <>
            <Box>
                <h2>Your Token Balances:</h2>
                <Box>
                    <WalletBalance token={supportedTokens[DRT_index]} />
                    <WalletBalance token={supportedTokens[DPT_index]} />
                </Box>
            </Box>
            <Box>
                <h2>Post Content:</h2>
                <Box>
                    <SubmitContent token={supportedTokens[DPT_index]} />
                </Box>
            </Box>
            <Box>
                <h2>Validate Content:</h2>
                <Box>
                    <ValidateContent />
                </Box>
            </Box>

        </>
    )
}

