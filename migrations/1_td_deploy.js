// const Str = require('@supercharge/strings')
// const BigNumber = require('bignumber.js');

var TDErc20 = artifacts.require("ERC20TD.sol");
var evaluator = artifacts.require("Evaluator.sol");
var ExerciceSolution = artifacts.require("ExerciceSolution.sol");

module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        await deployTDToken(deployer, network, accounts); 
        await deployEvaluator(deployer, network, accounts); 
        //await setPermissionsAndRandomValues(deployer, network, accounts); 
        await basics(deployer, network, accounts);
		await deployExerciceSolution(deployer, network, accounts);
		await deployRecap(deployer, network, accounts); 
    });
};

async function deployTDToken(deployer, network, accounts) {
	//TDToken = await TDErc20.new("TD-AAVE-101","TD-AAVE-101",web3.utils.toBN("20000000000000000000000000000"))
	TDToken = await TDErc20.at("0xEA6eF07Eb2D93F618120fF8AD6537f562e011790")
	aDAIAddress = "0xdcf0af9e59c002fa3aa091a46196b37530fd48a8"
	USDCAddress = "0xe22da380ee6b445bb8273c81944adeb6e8450422"
	variableDebtUSDCAddress = "0xbe9b058a0f2840130372a81ebb3181dce02be957"
	console.log(TDToken.address);
	console.log("######TDToken######");
	var mesPoints = await TDToken.balanceOf(accounts[0]);
	console.log(mesPoints.toString());
}

async function deployEvaluator(deployer, network, accounts) {
	//Evaluator = await evaluator.new(TDToken.address, aDAIAddress, USDCAddress, variableDebtUSDCAddress)
	Evaluator = await evaluator.at("0xF00a099b637841fB2D240ABEeDeb48719836fd6D")
	console.log(Evaluator.address);
	console.log("######Evaluator######");
	/*var exo = [1,2,3,4,5,6,7,8,9];
	for (var i of exo){
		var progresse = await Evaluator.exerciceProgression(accounts[0],i);
		console.log("exo "+i +" "+ progresse);
	}*/
}

async function setPermissionsAndRandomValues(deployer, network, accounts) {
	await TDToken.setTeacher(Evaluator.address, true)

}

async function basics(deployer, network, accounts){
	//EXo1 :
	//await Evaluator.ex1_showIDepositedTokens()
	var exo1=await Evaluator.exerciceProgression(accounts[0],1);
    console.log("exo1 "+exo1);
	//EXo2 :
	//await Evaluator.ex2_showIBorrowedTokens()
	var exo2=await Evaluator.exerciceProgression(accounts[0],2);
	console.log("exo2 "+exo2);

	//EXo3 :
	//await Evaluator.ex3_showIRepaidTokens();
	var exo3=await Evaluator.exerciceProgression(accounts[0],3);
	console.log("exo3 "+exo3);

	//EXo4 :
	//await Evaluator.ex4_showIWithdrewTokens();
	var exo4=await Evaluator.exerciceProgression(accounts[0],4);
	console.log("exo4 "+exo4);
}
async function deployExerciceSolution(deployer, network, accounts) {
	AAVEAddress= "0xE0fBa4Fc209b4948668006B2bE61711b7f465bAe";
	DAIAddress ="0xff795577d9ac8bd7d90ee22b6c1703490b6512fd";
	//ExerciceSolution= await ExerciceSolution.new(AAVEAddress,aDAIAddress, DAIAddress,USDCAddress, variableDebtUSDCAddress);
	ExerciceSolution = await ExerciceSolution.at("0x35a5557bbA609Eb2dcDEaa897f5b1E22E2f8590b");
	//await Evaluator.submitExercice(ExerciceSolution.address);
	//send DAI to yhe contract

	//EXo5 :
	//await Evaluator.ex5_showContractCanDepositTokens();
	var exo5=await Evaluator.exerciceProgression(accounts[0],5);
	console.log("exo5 "+exo5);

	//EXo6 :
	//await Evaluator.ex6_showContractCanBorrowTokens();
	var exo6=await Evaluator.exerciceProgression(accounts[0],6);
	console.log("exo6 "+exo6);

	//EXo7 :
	//await Evaluator.ex7_showContractCanRepayTokens();
	var exo7=await Evaluator.exerciceProgression(accounts[0],7);
	console.log("exo7 "+exo7);

	//EXo8 :
	//await Evaluator.ex8_showContractCanWithdrawTokens();
	var exo8=await Evaluator.exerciceProgression(accounts[0],8);
	console.log("exo8 "+exo8);

	//EXo9 : don't work
	await Evaluator.ex9_performFlashLoan();
	var exo9=await Evaluator.exerciceProgression(accounts[0],9);
	console.log("exo9 "+exo9);
}
async function deployRecap(deployer, network, accounts) {
	var exo = [1,2,3,4,5,6,7,8,9];
    for (var i of exo){
        var progresse = await Evaluator.exerciceProgression(accounts[0],i);
        console.log("exo "+i +" "+ progresse);
    }
    var mesPoints = await TDToken.balanceOf(accounts[0]);
    console.log(mesPoints.toString());
	console.log("TDToken " + TDToken.address);
	console.log("Evaluator " + Evaluator.address);
	console.log("ExerciceSolution "+ ExerciceSolution.address);
}


