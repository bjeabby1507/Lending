pragma solidity ^0.6.0;
import "./utils/IAAVELendingPool.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ExerciceSolution {
    address public Owner;
    IAAVELendingPool public pool;
    IERC20 public aDAI;
    IERC20 public DAI;
	IERC20 public USDC;
	IERC20 public variableDebtUSDC;

    constructor( IAAVELendingPool _pool, IERC20 _aDAI, IERC20 _DAI, IERC20 _USDC, IERC20 _variableDebtUSDC ) 
	public 
	{
        Owner = msg.sender;
        pool = _pool; //0xE0fBa4Fc209b4948668006B2bE61711b7f465bAe
        aDAI = _aDAI; //0xdcf0af9e59c002fa3aa091a46196b37530fd48a8
        DAI = _DAI; // 0xff795577d9ac8bd7d90ee22b6c1703490b6512fd
		USDC = _USDC; // 0xe22da380ee6b445bb8273c81944adeb6e8450422
		variableDebtUSDC = _variableDebtUSDC; //0xbe9b058a0f2840130372a81ebb3181dce02be95
	}

    modifier onlyOwner() {
        require(msg.sender == Owner );
        _;
    }

    fallback () external payable 
	{}
    
	receive () external payable 
	{}

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function sendViaCall(address payable _to) public payable onlyOwner {
        // Call returns a boolean value indicating success or failure.
        (bool sent, bytes memory data) = _to.call.value(address(this).balance)("");
        require(sent, "Failed to send Ether");
    }

    event Deposit(address reserve,address user,address onBehalfOf,uint256 amount,uint16 referral);
    function depositSomeTokens() public {

        // Contract should have testnet DAI
		require(DAI.balanceOf(address(this)) > 0, "Contract has no DAI");
        // Approve 200 DAI to LendingPool address
        uint amount = 200 * 10 ** 18;
        DAI.approve(address(pool), amount);
        // Deposit 200 DAI
        pool.deposit(address(DAI), amount,address(this),0);
        emit Deposit(address(DAI), address(msg.sender),address(this),amount,0);
    }

    event Withdraw(address reserve, address user, address to, uint256 amount);
	function withdrawSomeTokens() public {
        // Contract should have deposited testnet aDAI
		//require(aDAI.balanceOf(address(this)) > 0, "Contract has not deposited DAI in AAVE");
        uint256 amount1 = 100 * 10 ** 18;
        uint256 amount = pool.withdraw(address(DAI), amount1, address(this));
        emit Withdraw(address(USDC),address(msg.sender),address(this),amount);
    }

    event Borrow(address reserve,address user,address onBehalfOf,uint256 amount,uint256 borrowRateMode,uint16 referral);
	function borrowSomeTokens() public {
        uint amount = 10 * 10 ** 6;
        pool.borrow(address(USDC), amount, 2, 0, address(this));
        emit Borrow(address(USDC),address(msg.sender),address(this),amount,2,0);
    }

    event Repay(address reserve,address user,address repayer,uint256 amount);
	function repaySomeTokens() public {
        // Contract should have borrowed USDC on AAVE 
		//require(variableDebtUSDC.balanceOf(address(this)) > 0, "Contract has not borrowed USDC in AAVE");
        // Contract should have testnet USDC
		//require(USDC.balanceOf(address(this)) > 0, "Contract has no USDC");
        uint256 amount1 = 5 * 10 ** 6;
        USDC.approve(address(pool), amount1);
        uint256 amount = pool.repay(address(USDC), amount1, 2,address(this));
        emit Repay(address(USDC),address(msg.sender),address(this),amount);
    }

	function doAFlashLoan() public {
        //https://github.com/aave/code-examples-protocol/blob/main/V2/Flash%20Loan%20-%20Batch/MyV2FlashLoan.sol
        uint256 amountToBorrow = 1000000 * 1000000;
        bytes memory params = "";
        address[] memory assets = new address[](1);
        assets[0] = address(USDC);
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = amountToBorrow;
        uint256[] memory modes = new uint256[](7);
        modes[0] = 0;
        pool.flashLoan(address(this), assets, amounts, modes,address(this), params, 0);
    }

	function repayFlashLoan() external {
        uint256 amountToBorrow = 1000000 * 1000000;
        USDC.approve(address(pool), amountToBorrow);
    }

}