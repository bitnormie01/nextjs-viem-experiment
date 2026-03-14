import { NextRequest, NextResponse } from "next/server";
import {createPublicClient, formatEther, parseEther, http, isAddress} from 'viem'
import {sepolia} from 'viem/chains'  // <= SEPOLIA network
import 'dotenv/config';

//GOAL: It needs to extract the address from the URL,
const transport = http(process.env.SEPOLIA_RPC_URL); // <= hidden from browser (Actually, everything hidden in this file)🤫


const publicClient = createPublicClient({
    transport,
    chain:sepolia
})

//Function - To fetch the transaction counts of that address in ETH sepolia 🐦‍🔥
async function getTransactionCounts(address : `0x${string}`){
    const txCounts = await publicClient.getTransactionCount({ // <= will get the total tx counts with the given address arg
        address
    })
    return txCounts;
}

//Function - To get current balance of user (~ sepolia)
async function getTotalBalance(address : `0x${string}`){
    
    const balance = formatEther(await publicClient.getBalance({
        address
    }));
    return balance;
}
function checkIsAddress(address : string){
    return isAddress(address); // <= check if address is valid or not
}


export async function GET(request: NextRequest){

    //address verifier function :
    
    //get all the search params from the url:
    const searchParams = request.nextUrl.searchParams;
    
    //fetching address parameter's argument:
    const userAddress  = searchParams.get('address');
    if (!userAddress) return;
    else if(!checkIsAddress(userAddress)) return NextResponse.json({message: 'Not an valid address!'}, {status:401}) // <= Invalid address response

    if (!userAddress) {
        return NextResponse.json({error: 'Missing query parameter'}, {status: 400});
    }
    const validAddress = userAddress as `0x${string}`; //take query value to vaidAddress but change type to `0x${string}`
    const txCounts = await getTransactionCounts(validAddress);
    const balance = await getTotalBalance(validAddress);

    return NextResponse.json({Address: userAddress, txCounts, balance}, {status:200});
}


//this api will take userAddress in body
export async function POST(request: NextRequest){
    

    const body = await request.json();
    console.log(body);
    const userAddress = body.address;
    if(!checkIsAddress(userAddress!)) return NextResponse.json({message:'Not an valid address!'}, {status:400}) // <= Invalid address response

    const balance = await getTotalBalance(userAddress); // <= Get the balance of the user
    
    const balanceInBigInt = parseEther(balance);
    const result = balanceInBigInt >= parseEther('1');

    
    const response = {access: result, status: result ? 200 : 401, message: result ? "Welcome to the Secret Alpha, VIP!" : "Insufficient funds to enter.", Address:userAddress};
    
    console.log(response);
    return NextResponse.json(response);
}