import React, { useEffect, useState} from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";
import { ThemedView } from './components/ThemedView';
import { ThemedText } from './components/ThemedText'; 
import { ThemedButton } from './components/ThemedButton';
import { ThemedTextInput } from './components/ThemedTextInput';
import { SearchBar } from 'react-native-screens';

export default function Accounts() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<any[]>([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAccounts, setFilteredAccounts] = useState<any[]>([]);

  // Fetch accounts from the server
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('http://192.168.5.18:9000/api/accounts');
        const data = await response.json();  
        console.log(searchQuery); 

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
            {/* Search Bar */}
            <ThemedTextInput style={styles.searchBar} placeholder="Search by account name..."
                placeholderColor="#999" value={searchQuery} onChangeText={setSearchQuery}/>
            {/* Display Accounts */} 
            {filteredAccounts.length > 0 ? (
                filteredAccounts.map((account, index) => (
                <TouchableOpacity key={index} style={styles.account}>
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
});
