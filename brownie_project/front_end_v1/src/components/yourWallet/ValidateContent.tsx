import { useEthers, useTokenBalance, useNotifications, useContractFunction, useCall } from "@usedapp/core"
import { Button, Input, CircularProgress, Snackbar, MenuItem, FormControl, InputLabel, TextField, OutlinedInput, ButtonGroup, Box } from "@material-ui/core"
import { spacing } from '@mui/system';
import React, { ReactText, useState, useEffect } from "react"
import Ducia_v1 from "../../chain-info/contracts/Ducia_v1.json"
import { constants, utils } from "ethers"
import networkMapping from "../../chain-info/deployments/map.json"
import { Contract } from "@ethersproject/contracts"
import Select, { SelectChangeEvent } from '@mui/material/Select';

export const ValidateContent = () => {

    const { account, chainId } = useEthers()

    const [selected_content, set_selected_content] = useState('')


    const Ducia_v1_address = chainId ? networkMapping[String(chainId)]["Ducia_v1"][0] : constants.AddressZero
    const Ducia_v1_Interface = new utils.Interface(Ducia_v1.abi)
    const Ducia_v1_Contract = new Contract(Ducia_v1_address, Ducia_v1_Interface)

    const [all_contents, set_all_contents] = useState<string[]>([])

    const { value: content_array } = useCall({
        contract: Ducia_v1_Contract,
        method: "get_content",
        args: []
    }) ?? {}

    const { value: vote_stats } = useCall({
        contract: Ducia_v1_Contract,
        method: "get_current_voting_stats",
        args: [selected_content]
    }) ?? {}

    const somethingchosen = selected_content === '' ? true : false

    const handleGetContent = async () => {
        const new_all_contents = content_array.toString().split(",")
        set_all_contents(new_all_contents)
        console.log("Contenttt", all_contents)
    }
    console.log("valssue", selected_content)

    const { send: sendVote, state: sendVoteState } =
        useContractFunction(Ducia_v1_Contract, "vote", {
            transactionName: "Vote",
        })

    const handle_true_vote = () => {
        sendVote(selected_content, true)
    }

    const handle_false_vote = () => {
        sendVote(selected_content, false)
    }

    return <>
        <Button
            onClick={handleGetContent}
            color="primary"
            size="large">
            Update Available Content!
        </Button>
        <FormControl fullWidth>
            <TextField
                select
                value={selected_content}
                onChange={data => set_selected_content(data.target.value)}
                placeholder="Choose Content to Validate"
            >
                {all_contents.map((cont) => (
                    <MenuItem
                        value={cont}
                    >
                        {cont}
                    </MenuItem>
                ))}
            </TextField>
        </FormControl>

        <Box sx={{ mt: 3 }} >
            <div> Current Statistics for content: {selected_content}  </div>
        </Box>
        <Box sx={{ mt: 3 }}>
            <div> Number of validates: {somethingchosen ? "-" : (vote_stats ? vote_stats[1].toString() : "-")} </div>
            <div> Number of filters: {somethingchosen ? "-" : (vote_stats ? vote_stats[2].toString() : "-")} </div>
        </Box>

        <Box sx={{ mt: 3 }}>
            <ButtonGroup variant="contained" aria-label="outlined primary button group" disabled={somethingchosen} >
                <Button onClick={handle_true_vote}>Validate</Button>
                <Button onClick={handle_false_vote}>Filter</Button>
            </ButtonGroup>
        </Box>



    </>

}
