import { useEthers, useTokenBalance } from "@usedapp/core"
import { Token } from "../Main"
import helperConfig from "../../helper-config.json"
import { formatUnits } from "@ethersproject/units"
import { BalanceMsg } from "../BalanceMsg"

export interface WalletBalanceProps {
    token: Token
}

export const WalletBalance = ({ token }: WalletBalanceProps) => {
    const { image, address, name } = token
    const { account } = useEthers()

    //console.log("Account", account)
    //console.log("Address", address)

    const tokenBalance = useTokenBalance(address, account)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0

    //console.log("Token Balance", formattedTokenBalance)

    const label_text = name === "DRT" ? "Your balance of Ducia Reputation Tokens" : "Your balance of Ducia Post Tokens"

    return (<BalanceMsg
        label={label_text}
        amount={formattedTokenBalance}
        tokenImgSrc={image} />)
}