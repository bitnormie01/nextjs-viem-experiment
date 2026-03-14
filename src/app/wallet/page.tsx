'use client' // <= ORDER to next.js: run this component on browser side

import {useState} from 'react';
import Loader from '../components/loadingSpinner'



export default function WalletFetcher(){
    
    const WHITELIST_SUCCESS = 'Welcome to the Secret Alpha, VIP!';
    const WHITELIST_FAILED = 'Insufficient funds to enter (1 ETH required).';
    const [address, setAddress] = useState("");
    const [fetching, setFetching] = useState(false);
    const [addressError, setAddressError] = useState('');
    const [lastCheckedAddress, setLastCheckedAddress] = useState(''); 
    const [wallet, setWallet] = useState({
        balance: "",
        txCount: null as number |null,
        whitelist: ''
    });

    // 
    function setOnlyBalance(balanceAmount : string){
        setWallet((prev)=>{
            return {...prev, balance:balanceAmount}
        });
    }
        function setOnlyTx(tx : number | null){
        setWallet((prev)=>{
            return {...prev, txCount:tx}
        });
    }
        function setOnlyWhitelist(address : string){
        setWallet((prev)=>{
            return {...prev, whitelist:address}
        });
    }
        function resetWalletState(){
            setWallet({balance:'', txCount: null, whitelist: ''});
        }


    function basicAddressVerifier(){
        if (!address.startsWith('0x') || address.length !== 42) {  //Added basic address lookup for better UX
            setAddressError("Invalid address format!")
        return true;
        }
        return false;
    }


    async function fetchWalletData(){

        if(lastCheckedAddress!==address){ // <= If address is changed, then remove whitelist text
            resetWalletState();            
            if (basicAddressVerifier()) return;
            } 
        else if (lastCheckedAddress===address && wallet.balance ){return;} // <= Do nothing if last address is same as new address

        try{

            setFetching(true);  
        
        const res = await fetch(`/api/wallet?address=${address}`, {
            cache:'no-store', 
        })
        const responseObject = await res.json();
        if (!res.ok) { // <= set error message if address is invalid(api status response:400)
            setAddressError(responseObject.message) 
            return ;
        }  
        else setAddressError('');  
        
        const {balance, Address, txCounts} = responseObject;

        if(!txCounts || !balance)return
        setLastCheckedAddress(Address); 
        setOnlyTx(txCounts);
        setOnlyBalance(balance);
        
        }catch(error){
            console.error('Network error: ', error)
        }

        finally{setFetching(false)}    // <= Change it back to false after either success/Failure response

    }

    //POST method fetching:
    async function checkWhitelist(){
        if(lastCheckedAddress!==address) { // <= if address is changed, then set txCounts, addressError and userBalance to default
            setOnlyTx(null);
            resetWalletState();
            if (basicAddressVerifier()) return;

        }
        else if (address===lastCheckedAddress && wallet.whitelist) return;  // <= Skip this function, if address is same as before

        try{

            setFetching(true);  


            const res = await fetch('/api/wallet', {
                cache:'no-store', method: 'POST', headers: {'Content-Type': 'application/json'}, body:JSON.stringify({address:address})    // <== calling post Function(method) from router handler
            })
            const responseObject = await res.json();
            const {status, Address } = responseObject;

            if (!res.ok) {  
                setAddressError(responseObject.message);
                setOnlyWhitelist('');
                return;
            } 
            else setAddressError('');  

            const {access} = responseObject;  
            setLastCheckedAddress(Address); 
            setOnlyWhitelist(access ? WHITELIST_SUCCESS : WHITELIST_FAILED) // <= set whether user is whitelist to enter or not (is displaying)
            
        }catch(error){
            console.error('Network error: ', error);
            
            }
        finally{ setFetching(false)}                // <= Change it back to false after either success/Failure
    }


    // <-----UI------>
    return(
        
        <div className=' flex justify-center  self-center place-self-center min-w-full min-h-[90%]'>
        <div className='min-h-[80vh] flex flex-col place-self-center  place-items-center p-20  border antialiased border-slate-500 bg-linear-to-l from-black to-slate-950 shadow-sm rounded-lg transition-all duration-900  hover:border-slate-700 hover:shadow-2xl'>
            <h1 className='text-xl underline underline-offset-4 '>{` Sepolia (ETH) Tx counter, Balance checker and Whitelist (balance >= 1 ether)`}</h1>
{/* Loader component */}
            <div className='size-8 -mb-14 mt-10 mr-20'>
                {fetching && <Loader/>}
            </div>
            {<input type='text' value={address} onChange={(e)=>{setAddress(e.target.value); setAddressError('')}} className={`mt-36   ${addressError ? 'animate-shake border border-red-800 ring-0' : wallet.balance || wallet.whitelist ?'border border-green-500' : 'border'}  rounded-lg p-3 w-80 transition-transform duration-100 focus:scale-105`} placeholder='Address here..'/>}
            {addressError && <span className='text-red-500 mt-1 -mb-4 animate-shake'>{addressError}</span>}
            <div className='flex align-middle gap-2 mt-10'>
                <button disabled={fetching} onClick={fetchWalletData} className=' disabled:cursor-not-allowed disabled:bg-indigo-300 border-2 border-indigo-500 bg-indigo-400 cursor-pointer p-2 rounded-full w-40 mt-5 transition-all duration-200 hover:bg-indigo-500 active:scale-95'>
                    Check wallet
                </button>
                <button disabled={fetching} onClick={checkWhitelist} className=' disabled:cursor-not-allowed disabled:bg-red-300 border-2 border-red-500 bg-red-400 cursor-pointer p-2 rounded-full w-40 mt-5 transition-all duration-200 hover:bg-red-500 active:scale-95'>
                    Check Whitelist
                </button>   
            </div>
{/* Display results */}
        {wallet.whitelist && <span className={`text-lg ${wallet.whitelist.startsWith('W') ? 'text-green-400' : 'text-red-600'} font-serif mt-2 animate-pulse `}>{wallet.whitelist}</span>}
            <div className='eth-balance mt-4 '>Balance:
                {wallet.balance && <span className='text-green-400 font-mono'>{` ${wallet.balance} ether`}</span>}
            </div>
            <div className='tx-count'>Transactions:

                {wallet.txCount && <span className='text-green-400 font-mono'>{` ${wallet.txCount} tx`}</span>}
            </div>
        </div>
        </div>
        
    
)

}