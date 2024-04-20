import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DatabaseConnection } from '../../database/database';
import { SafeAreaView } from 'react-native-safe-area-context';

const db = DatabaseConnection.getConnection();

export default function PesquisaCliente() {
    const navigation = useNavigation();
    const [input, setInput] = useState('');
    const [resultados, setResultados] = useState([]);

    const handleSearch = () => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT c.nome, c.data_nasc, t.numero FROM Clientes c LEFT JOIN tbl_telefones_has_tbl_pessoa tp ON c.id = tp.id_pessoa LEFT JOIN Telefones t ON tp.id_telefone = t.id WHERE c.nome LIKE ? OR t.numero LIKE ?',
                [`%${input}%`, `%${input}%`],
                (_, { rows }) => {
                    setResultados(rows._array);
                }
            );
        });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('DetalhesCliente', { id: item.id })}>
            <Text style={styles.itemText}>{item.nome}</Text>
        </TouchableOpacity>
    );

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Pesquisar Cliente</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite o nome ou número de telefone do cliente"
                value={input}
                onChangeText={text => setInput(text)}
            />
            <TouchableOpacity style={styles.button} onPress={handleSearch}>
                <Text style={styles.buttonText}>Pesquisar</Text>
            </TouchableOpacity>
            <FlatList
                data={resultados}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                contentContainerStyle={{ flexGrow: 1 }}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum cliente encontrado.</Text>}
            />
            <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
                <Text style={styles.goBackButtonText}>Voltar</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemText: {
        fontSize: 18,
    },
    emptyText: {
        fontSize: 18,
        textAlign: 'center',
    },
    goBackButton: {
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 5,
    },
    goBackButtonText: {
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
