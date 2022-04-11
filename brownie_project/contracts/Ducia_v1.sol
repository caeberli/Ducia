// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Ducia_v1 is Ownable {
    mapping(address => uint256) public reputation;
    mapping(address => uint256) public reputation_retrievable;
    mapping(uint256 => mapping(address => bool)) public votes;
    mapping(uint256 => mapping(address => bool)) public has_voted;
    mapping(uint256 => last_vote) public last_vote_map;
    mapping(uint256 => bool) public content_exists;
    mapping(uint256 => validation_tracker) public vote_tracker;

    uint256[] public content;
    address[] public validators;

    struct last_vote {
        bool not_first_vote;
        address user;
        bool vote;
    }

    struct validation_tracker {
        uint256 number_votes;
        uint256 yes_votes;
        uint256 no_votes;
    }

    IERC20 public reptoken;
    IERC20 public posttoken;

    constructor(address reptoken_address, address posttoken_address) {
        reptoken = IERC20(reptoken_address);
        posttoken = IERC20(posttoken_address);
    }

    function give_post_tokens(address _user, uint256 _amount) public {
        posttoken.transferFrom(msg.sender, _user, _amount);
    }

    function get_rep_tokens(address _user) public {
        require(
            reputation_retrievable[_user] > 0,
            "No Rep Tokens to be retrieved!"
        );
        uint256 amount = reputation_retrievable[_user];
        reputation_retrievable[_user] = 0;
        reptoken.transferFrom(msg.sender, _user, amount);
    }

    function get_user_rep_tokens(address _user) public view returns (uint256) {
        return reptoken.balanceOf(_user);
    }

    function get_user_post_tokens(address _user) public view returns (uint256) {
        return posttoken.balanceOf(_user);
    }

    function get_current_voting_stats(uint256 _content_id)
        public
        view
        returns (
            uint256,
            uint256,
            uint256
        )
    {
        uint256 number_votes = vote_tracker[_content_id].number_votes;
        uint256 yes_votes = vote_tracker[_content_id].yes_votes;
        uint256 no_votes = vote_tracker[_content_id].no_votes;
        return (number_votes, yes_votes, no_votes);
    }

    function get_user_reputation(address _user) public view returns (uint256) {
        return reputation[_user];
    }

    function vote(uint256 _content_id, bool _vote) public {
        require(
            has_voted[_content_id][msg.sender] == false,
            "User has already Voted"
        );
        has_voted[_content_id][msg.sender] = true;
        votes[_content_id][msg.sender] = _vote;
        validation_tracker memory current_validation_tracker = vote_tracker[
            _content_id
        ];
        current_validation_tracker.number_votes += 1;
        if (_vote == true) {
            current_validation_tracker.yes_votes += 1;
        } else {
            current_validation_tracker.no_votes += 1;
        }
        vote_tracker[_content_id] = current_validation_tracker;

        last_vote memory last_vote_this = last_vote_map[_content_id];

        if (
            last_vote_this.not_first_vote == true &&
            last_vote_this.vote == _vote
        ) {
            uint256 reward = calculate_reward(
                _vote,
                current_validation_tracker
            );
            assign_reward(reward, last_vote_this.user);
        }
        last_vote_this.not_first_vote = true;
        last_vote_this.user = msg.sender;
        last_vote_this.vote = _vote;
        last_vote_map[_content_id] = last_vote_this;
    }

    function assign_reward(uint256 _amount, address _user) internal {
        reputation[_user] += _amount;
        reputation_retrievable[_user] += _amount;
    }

    function calculate_reward(
        bool _vote,
        validation_tracker memory _current_validation_tracker
    ) internal pure returns (uint256) {
        uint256 _yes_votes = _current_validation_tracker.yes_votes + 1;
        uint256 _no_votes = _current_validation_tracker.no_votes + 1;
        if (_vote == false) {
            uint256 amount = (10**18 * _yes_votes) / (_yes_votes + _no_votes);
            return amount;
        } else {
            uint256 amount = (10**18 * _no_votes) / (_yes_votes + _no_votes);
            return amount;
        }
    }

    function check_content_exists(uint256 _content_id)
        public
        view
        returns (bool)
    {
        return content_exists[_content_id];
    }

    function submit_content(uint256 _content_id) public {
        require(
            posttoken.balanceOf(msg.sender) >= 10**18,
            "Not enough Ducia Post Tokens!"
        );
        posttoken.transferFrom(msg.sender, address(this), 10**18);
        require(
            content_exists[_content_id] == false,
            "Same content has already been submitted!"
        );
        content_exists[_content_id] = true;
        content.push(_content_id);
    }
}
