import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Alert, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DatabaseConnection } from '../../database/database';

const db = DatabaseConnection.getConnection();

export default function Home() {
    const [todos, setTodos] = useState([]);

    const navigation = useNavigation();

    const goToCadastro = () => {
        navigation.navigate('Cadastro');
    }

    const goToListaClientes = () => {
        navigation.navigate('ListaClientes');
    }

    const goToPesquisaCliente = () => {
        navigation.navigate('PesquisaCliente');
    }

    const deleteDatabase = () => {
        db.transaction(
            tx => {
                tx.executeSql(
                    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
                    [],
                    (_, { rows }) => {
                        rows._array.forEach(table => {
                            tx.executeSql(
                                `DROP TABLE IF EXISTS ${table.name}`,
                                [],
                                () => {
                                    console.log(`Tabela ${table.name} excluída com sucesso`);
                                    setTodos([]);
                                },
                                (_, error) => {
                                    console.error(`Erro ao excluir a tabela ${table.name}:`, error);
                                    Alert.alert('Erro', `Ocorreu um erro ao excluir a tabela ${table.name}.`);
                                }
                            );
                        });
                    },
                    (_, error) => {
                        console.error('Erro ao buscar as tabelas:', error);
                        Alert.alert('Erro', 'Ocorreu um erro ao buscar as tabelas.');
                    }
                );
            }
        );
    };

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS Clientes (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, data_nasc TEXT)",
                [],
                () => console.log("Tabela 'Clientes' criada"),
                (error) => console.log("Erro ao criar tabela 'Clientes':", error)
            );

            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS Telefones (id INTEGER PRIMARY KEY AUTOINCREMENT, numero TEXT)",
                [],
                () => console.log("Tabela 'Telefones' criada"),
                (error) => console.log("Erro ao criar tabela 'Telefones':", error)
            );

            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS tbl_telefones_has_tbl_pessoa (id_telefone INTEGER, id_pessoa INTEGER, CONSTRAINT fk_tbl_telefone_id FOREIGN KEY (id_telefone) REFERENCES tbl_telefones (id), CONSTRAINT fk_tbl_pessoa_id FOREIGN KEY (id_pessoa) REFERENCES tbl_clientes (id))",
                [],
                () => console.log("Tabela 'tbl_telefones_has_tbl_pessoa'"),
                (error) => console.log("Erro ao criar tabela 'tbl_telefones_has_tbl_pessoa':", error)
            );
        });
    }, [todos]);

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={goToCadastro} style={styles.button}>
                <Text style={styles.buttonText}>Ir para Cadastro</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToListaClientes} style={styles.button}>
                <Text style={styles.buttonText}>Ir para Lista de Clientes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToPesquisaCliente} style={styles.button}>
                <Text style={styles.buttonText}>Ir para Pesquisa de Cliente</Text>
            </TouchableOpacity>
            <View style={styles.SuicidBu}>
                <Button title="Button Suicide" onPress={() => {
                    Alert.alert(
                        "Atenção!",
                        'Deseja excluir oO BANCO DE DADOS????? VC VAI PERDE TUDO E N TEM VOLTA!',
                        [
                            {
                                text: 'HAHAHAHAAHHAAH SIM',
                                onPress: () => deleteDatabase()
                            },
                            {
                                text: 'uops não',
                                onPress: () => { return }
                            }
                        ],
                    )

                }} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    SuicidBu:{
        bottom: 10,
        position: 'absolute',
        width: '80%',
    }
});