from brownie import RepToken, PostToken, Ducia_v1, network, config
from scripts.helpful_scripts import get_account, LOCAL_BLOCKCHAIN_ENVIRONMENTS
from web3 import Web3
import yaml
import json
import os
import shutil

initial_supply_rep = Web3.toWei(1000000, "ether")
initial_supply_post = Web3.toWei(1000000, "ether")


def main():
    deploy_ducia(front_end_update=True)


def deploy_ducia(front_end_update=False):
    account = get_account()
    rep_token = RepToken.deploy(
        initial_supply_rep,
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )
    post_token = PostToken.deploy(
        initial_supply_post,
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )
    ducia_v1 = Ducia_v1.deploy(
        rep_token.address,
        post_token.address,
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )
    # here we could send tokens to the ducia smart contract so we can use the transfer easier in there
    print(f"Rep Token deployed to {rep_token.address}")
    print(f"Post Token deployed to {post_token.address}")
    print(f"Ducia_v1 deployed to {ducia_v1.address}")

    if front_end_update:
        update_front_end()

    return rep_token, post_token, ducia_v1


def update_front_end():

    copy_folders_to_front_end("./build", "./front_end_v1/src/chain-info")

    with open("brownie-config.yaml", "r") as brownie_config:
        config_dict = yaml.load(brownie_config, Loader=yaml.FullLoader)
        with open("./front_end_v1/src/brownie-config.json", "w") as brownie_config_json:
            json.dump(config_dict, brownie_config_json)
    print("Front end updated!")


def copy_folders_to_front_end(src, dest):
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)
