import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Paper,
  CircularProgress
} from '@mui/material';
import VaultABI from './contracts/Vault.json';

const VAULT_ADDRESS = "0xFD471836031dc5108809D173A067e8486B9047A3"; // 실제 배포된 컨트랙트 주소로 변경 필요

// Window 타입 확장
declare global {
  interface Window {
    ethereum?: any;
  }
}

function App() {
  const [account, setAccount] = useState<string>("");
  const [vaultContract, setVaultContract] = useState<ethers.Contract | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [borrowed, setBorrowed] = useState<string>("0");
  const [maxBorrowable, setMaxBorrowable] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        setAccount(address);

        const contract = new ethers.Contract(VAULT_ADDRESS, VaultABI.abi, signer);
        setVaultContract(contract);
      } else {
        alert("메타마스크를 설치해주세요!");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const updateBalances = useCallback(async () => {
    if (vaultContract && account) {
      try {
        const balance = await vaultContract.getBalance(account);
        const borrowed = await vaultContract.getBorrowed(account);
        const maxBorrowable = await vaultContract.getMaxBorrowable(account);

        setBalance(ethers.formatEther(balance));
        setBorrowed(ethers.formatEther(borrowed));
        setMaxBorrowable(ethers.formatEther(maxBorrowable));
      } catch (error) {
        console.error("Error updating balances:", error);
      }
    }
  }, [vaultContract, account]);

  useEffect(() => {
    if (vaultContract && account) {
      updateBalances();
    }
  }, [vaultContract, account, updateBalances]);

  const handleDeposit = async () => {
    if (!vaultContract || !amount) return;
    try {
      setLoading(true);
      const tx = await vaultContract.deposit(ethers.parseEther(amount), {
        value: ethers.parseEther(amount)
      });
      await tx.wait();
      await updateBalances();
      setAmount("");
    } catch (error) {
      console.error("Error depositing:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!vaultContract || !amount) return;
    try {
      setLoading(true);
      const tx = await vaultContract.withdraw(ethers.parseEther(amount));
      await tx.wait();
      await updateBalances();
      setAmount("");
    } catch (error) {
      console.error("Error withdrawing:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!vaultContract || !amount) return;
    try {
      setLoading(true);
      const tx = await vaultContract.borrow(ethers.parseEther(amount));
      await tx.wait();
      await updateBalances();
      setAmount("");
    } catch (error) {
      console.error("Error borrowing:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRepay = async () => {
    if (!vaultContract || !amount) return;
    try {
      setLoading(true);
      const tx = await vaultContract.repay({
        value: ethers.parseEther(amount)
      });
      await tx.wait();
      await updateBalances();
      setAmount("");
    } catch (error) {
      console.error("Error repaying:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Lending Protocol
        </Typography>

        {!account ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button variant="contained" onClick={connectWallet}>
              Connect Wallet
            </Button>
          </Box>
        ) : (
          <>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Account: {account}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography>Balance: {balance} ETH</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography>Borrowed: {borrowed} ETH</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography>Max Borrowable: {maxBorrowable} ETH</Typography>
                </Box>
              </Box>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <TextField
                fullWidth
                label="Amount (ETH)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleDeposit}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : "Deposit"}
                  </Button>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleWithdraw}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : "Withdraw"}
                  </Button>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleBorrow}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : "Borrow"}
                  </Button>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleRepay}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : "Repay"}
                  </Button>
                </Box>
              </Box>
            </Paper>
          </>
        )}
      </Box>
    </Container>
  );
}

export default App;
