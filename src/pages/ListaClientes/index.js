import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DatabaseConnection } from '../../database/database';
import { SafeAreaView } from 'react-native-safe-area-context';

const db = DatabaseConnection.getConnection();

export default function ListaClientes() {
    const [clientes, setClientes] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            carregaClientes();
        });

        return unsubscribe;
    }, [navigation]);

    const carregaClientes = () => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM Clientes',
                [],
                (_, { rows }) => {
                    setClientes(rows._array);
                }
            );
        });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('DetalheCliente', { id: item.id })}>
            <Text style={styles.itemText}>{item.nome}</Text>
        </TouchableOpacity>
    );

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleNavigateToCadastro = () => {
        navigation.navigate('Cadastro');
    };

    return (
        <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Lista de Clientes</Text>
                </View>
                <FlatList
                    data={clientes}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={clientes.length === 0 && styles.emptyListContainer}
                    ListEmptyComponent={<Text style={styles.emptyText}>Nenhum cliente cadastrado.</Text>}
                />
                <TouchableOpacity style={styles.button} onPress={handleNavigateToCadastro}>
                    <Text style={styles.buttonText}>Cadastrar Novo Cliente</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
                    <Text style={styles.buttonText}>Voltar</Text>
                </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#007bff',
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    item: {
        backgroundColor: '#fff',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemText: {
        fontSize: 18,
    },
    emptyListContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    emptyText: {
        fontSize: 18,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
        marginHorizontal: 20,
    },
    goBackButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 20,
        marginHorizontal: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});
