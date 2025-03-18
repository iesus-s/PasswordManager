import React, { useEffect, useState} from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from "expo-router";
import { ThemedView } from './components/ThemedView';
import { ThemedText } from './components/ThemedText'; 
import { ThemedButton } from './components/ThemedButton';
import { ThemedTextInput } from './components/ThemedTextInput';  
import * as Clipboard from 'expo-clipboard';
import CryptoJS from 'crypto-js';  

export default function Accounts() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<any[]>([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAccounts, setFilteredAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<any>(null); 
  // Handle copy to clipboard
  const [copiedText, setCopiedText] = useState('');
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(decrypt(selectedAccount.password));
  };
  const fetchCopiedText = async () => {
    const text = await Clipboard.getStringAsync();
    setCopiedText(text);
  };
  // Handle account click
  const [modalVisible, setModalVisible] = useState(false);
  const handleAccountClick = (account: any) => {setSelectedAccount(account); setModalVisible(true);};
  // Close modal
  const closeModal = () => {setSelectedAccount(null); setModalVisible(false);};
  // Secret Key
  const [secretKey, setSecretKey] = useState('');

  // Decrypt function
  const decrypt = (encryptedData: string): string => {
    try {
      const parts = encryptedData.split(':');
      if (parts.length !== 2) {
        throw new Error('Invalid encrypted data format. Expected format: iv:encryptedPassword');
      }
  
      const [ivHex, encryptedHex] = parts; 
  
      const iv = CryptoJS.enc.Hex.parse(ivHex);
      const encrypted = CryptoJS.enc.Hex.parse(encryptedHex); 
  
      // Properly create CipherParams object
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: encrypted
      });
  
      const decrypted = CryptoJS.AES.decrypt(
        cipherParams,
        CryptoJS.enc.Hex.parse(secretKey),  
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }
      );
  
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      if (!decryptedString) throw new Error('Decryption failed. Invalid password or secret key.'); 

      return decryptedString;
    } catch (error) { 
      return 'Not Available';
    }
  };

  // Fetch accounts from the server
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('http://192.168.1.241:8080/api/accounts');
        const data = await response.json();   

        if (response.ok) {
            setAccounts(data.data); 
            setFilteredAccounts(data);
        } else {
            console.log('Failed to fetch accounts:');
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }  
    };

    fetchAccounts();
  }, []);

  // Update filtered accounts as the search query changes
  useEffect(() => {
    setFilteredAccounts(
      accounts.filter(account =>
        account.account.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    );
  }, [searchQuery, accounts]);

  return (
    // PLACE SCROLLVIEW AND THEMEDVIEW CONTAINER BY DEFAULT IN ALL SCREENS
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Accounts</ThemedText> 
            {/* Secret Key */}
            <ThemedTextInput style={styles.searchBar} placeholder="Secret Key"
                placeholderColor="#999" value={secretKey} onChangeText={setSecretKey}/>
            {/* Search Bar */}
            <ThemedTextInput style={styles.searchBar} placeholder="Search by account name..."
                placeholderColor="#999" value={searchQuery} onChangeText={setSearchQuery}/>
            {/* Display Accounts */} 
            {filteredAccounts.length > 0 ? (
                filteredAccounts.map((account, index) => (
                  <TouchableOpacity key={index} style={styles.account} onPress={() => handleAccountClick(account)}>
                  <ThemedText style={styles.accountText}>Account: {account.account}</ThemedText> 
                  <ThemedText style={styles.accountText}>Username: {account.username}</ThemedText> 
                  <ThemedText style={styles.accountText}>Email: {account.email}</ThemedText> 
                  <ThemedText style={styles.accountText}>Password: {account.password}</ThemedText> 
                  <ThemedText style={styles.accountText}>Date Created: {new Date(account.create_date).toLocaleDateString()}</ThemedText>                 
                </TouchableOpacity>
                ))
            ) : (
                <ThemedText type="body">No accounts found.</ThemedText>
            )}
        <ThemedButton onPress={() => router.push('./main')} title="Go Back" />

        {/* Account Modal */}
        {selectedAccount && (
          <Modal visible={modalVisible} transparent animationType="fade" 
                  onRequestClose={closeModal}>
            <ThemedView style={styles.modalOverlay}>
              <ThemedView style={styles.modalContainer}>
                <ThemedText type="request" style={styles.modalTitle}>Account Details</ThemedText>
                <ThemedText style={styles.modalText}>Account: {selectedAccount.account}</ThemedText>
                <ThemedText style={styles.modalText}>Username: {decrypt(selectedAccount.username)}</ThemedText>
                <ThemedText style={styles.modalText}>Email: {decrypt(selectedAccount.email)}</ThemedText>
                <ThemedText style={styles.modalText}>Password: {decrypt(selectedAccount.password)}</ThemedText>
                <ThemedText style={styles.modalText}>Date Created: {new Date(selectedAccount.create_date).toLocaleDateString()}</ThemedText>
                {/* Container for options */}
                <ThemedView style={styles.buttonContainer}>
                  <ThemedButton onPress={copyToClipboard} title="Copy Password" />
                  <ThemedButton onPress={closeModal} title="Close" />
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </Modal>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', 
    paddingBottom: 30,
  }, 
  searchBar: {
    width: '90%',   
  },
  account: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '90%',
  },
  accountText: {
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 400,
    padding: 20,
    borderRadius: 10, 
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.8)',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {   
    marginTop: 20,    
    alignItems: 'center',
  },
});
