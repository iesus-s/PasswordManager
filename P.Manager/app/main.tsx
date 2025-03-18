import React, { useState } from 'react'; 
import { useRouter } from "expo-router";
import { StyleSheet, Modal } from 'react-native'; 
import { generatePassword } from './utils/passwordUtils';   
import { ThemedText } from "./components/ThemedText";
import ThemedButton from './components/ThemedButton';
import ThemedView from './components/ThemedView';
import { ThemedTextInput } from './components/ThemedTextInput';  

export default function App() { 
  // Generate router constant
  const router = useRouter(); 
  // Generate account constant
  const [account, setAccount] = useState('');
  // Generate new username constant
  const [username, setUser] = useState(''); 
  // Generate new email constant
  const [email, setEmail] = useState('');
  // Generate new password constant
  const [password, setNewPassword] = useState('');   
  // Save password constant
  const [savePassword, setSavePassword] = useState('');
  // Save password modal
  const [isSavePasswordModalVisible, setSavePasswordModalVisible] = useState(false);
  const toggleSavePasswordModal = () => setSavePasswordModalVisible(!isSavePasswordModalVisible);
  // Message modal
  const [message, setMessage] = useState(''); 
  const [isMessageModalVisible, setMessageModalVisible] = useState(false);
  const toggleMessageModal = () => setMessageModalVisible(!isMessageModalVisible);

  // Function to generate a new password
  const handleGeneratePassword = () => {
    setNewPassword(generatePassword());
  }; 

  // Function to save password
  const handleSavePassword = async () => {
    if (!account) {
      setMessage('Please enter an account name.');
      toggleMessageModal(); // Make sure this is triggered
      return;
    }
  
    try {
      const response = await fetch('http://192.168.1.241:8080/api/accounts/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account, username, email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) { 
        setMessage('Account Created!');
        toggleMessageModal();  
        toggleSavePasswordModal();  
      } else {
        setMessage(data.message || 'Failed to create account.');
        toggleMessageModal(); // Show error message in modal
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
      toggleMessageModal(); // Show error message in modal
    }
  };
  

  return (
    // Generate new password view
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text}>Generate Password: </ThemedText>
      <ThemedText style={styles.passwordText}> { password } </ThemedText>
      {/* Generate new password button */}
      <ThemedButton title="Generate Password" onPress={handleGeneratePassword} />
      {/* Save password button */}  
      <ThemedButton title="Create New Entry" onPress={toggleSavePasswordModal} />
      {/* Display all entries button */}
      <ThemedView style={styles.allAccountsButton}>
        <ThemedButton title="All Accounts" onPress={() => router.push('./accounts')} />
      </ThemedView>

      {/* Save Password Modal */}
      <Modal visible={isSavePasswordModalVisible} transparent animationType="fade" 
                onRequestClose={toggleSavePasswordModal}>
          <ThemedView style={styles.modalOverlay}>
            <ThemedView style={styles.modalContainer}>
              <ThemedText type="request" style={styles.modalTitle}>Create New Entry</ThemedText>
              
              {/* Input for Account */}
              <ThemedTextInput placeholder="Account" value={account}
                onChangeText={setAccount} />
              {/* Input for Username */}
              <ThemedTextInput placeholder="Username" value={username}
                onChangeText={setUser} />
              {/* Input for Email */}
              <ThemedTextInput placeholder="Email" value={email}
                onChangeText={setEmail} />
              {/* Input for Password */}
              <ThemedTextInput placeholder="Password" value={password}
                onChangeText={setSavePassword} secureTextEntry/>
              
              {/* Container for options */}
              <ThemedView style={styles.buttonContainer}>
                <ThemedButton onPress={handleSavePassword} title="Submit" />
                <ThemedButton onPress={toggleSavePasswordModal} title="Cancel" />
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </Modal>

        {/* Message Modal */}
        <Modal visible={isMessageModalVisible} transparent animationType="fade" 
                onRequestClose={toggleMessageModal}>
          <ThemedView style={styles.modalOverlay}>
            <ThemedView style={styles.modalContainer}>
              <ThemedText type="request" style={styles.modalTitle}>{message}</ThemedText>
              <ThemedView style={styles.buttonContainer}>
                <ThemedButton onPress={toggleMessageModal} title="Ok" />
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </Modal> 
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20, 
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  passwordText: {
    fontSize: 20, 
    marginBottom: 20,
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
  buttonContainer: {   
    marginTop: 20,    
    alignItems: 'center',
  },
  allAccountsButton: {
    marginTop: 80, 
  }
});
