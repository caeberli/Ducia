from brownie import network, exceptions
from scripts.helpful_scripts import LOCAL_BLOCKCHAIN_ENVIRONMENTS, get_account
from scripts.deploy_tokens_and_ducia import deploy_ducia
import pytest
from web3 import Web3


def test_post_token_permissions():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing!")

    owner = get_account()
    non_owner_1 = get_account(index=1)

    rep_token, post_token, ducia_v1 = deploy_ducia()

    with pytest.raises(exceptions.VirtualMachineError):
        ducia_v1.give_post_tokens(non_owner_1, 5, {"from": non_owner_1})

    assert ducia_v1.get_user_post_tokens(non_owner_1, {"from": owner}) == Web3.toWei(
        0, "ether"
    )

    assert ducia_v1.get_user_post_tokens(owner, {"from": owner}) >= Web3.toWei(
        5, "ether"
    )

    post_token.approve(ducia_v1.address, Web3.toWei(10, "ether"), {"from": owner})
    ducia_v1.give_post_tokens(non_owner_1, Web3.toWei(5, "ether"), {"from": owner})

    assert ducia_v1.get_user_post_tokens(non_owner_1, {"from": owner}) == Web3.toWei(
        5, "ether"
    )


def test_submit_content():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing!")

    owner = get_account()
    non_owner_1 = get_account(index=1)

    rep_token, post_token, ducia_v1 = deploy_ducia()

    post_token.approve(ducia_v1.address, Web3.toWei(10, "ether"), {"from": owner})

    assert ducia_v1.check_content_exists(3, {"from": owner}) == False

    ducia_v1.submit_content(3, {"from": owner})

    assert ducia_v1.check_content_exists(3, {"from": owner}) == True

    with pytest.raises(exceptions.VirtualMachineError):
        ducia_v1.submit_content(3, {"from": non_owner_1})

    ducia_v1.give_post_tokens(non_owner_1, Web3.toWei(5, "ether"), {"from": owner})

    post_token.approve(ducia_v1.address, Web3.toWei(3, "ether"), {"from": non_owner_1})

    ducia_v1.submit_content(5, {"from": non_owner_1})

    with pytest.raises(exceptions.VirtualMachineError):
        ducia_v1.submit_content(3, {"from": non_owner_1})


def test_submit_vote_reward():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing!")

    owner = get_account()
    non_owner_1 = get_account(index=1)

    rep_token, post_token, ducia_v1 = deploy_ducia()

    post_token.approve(ducia_v1.address, Web3.toWei(10, "ether"), {"from": owner})

    ducia_v1.submit_content(3, {"from": owner})

    ducia_v1.vote(3, True, {"from": owner})
    with pytest.raises(exceptions.VirtualMachineError):
        ducia_v1.vote(3, True, {"from": owner})

    assert ducia_v1.get_user_reputation(owner) == Web3.toWei(0, "ether")

    ducia_v1.vote(3, True, {"from": non_owner_1})

    assert ducia_v1.get_user_reputation(owner) >= Web3.toWei(0.2, "ether")
    assert ducia_v1.get_user_reputation(owner) <= Web3.toWei(0.4, "ether")

    assert ducia_v1.get_user_reputation(non_owner_1) == Web3.toWei(0, "ether")
