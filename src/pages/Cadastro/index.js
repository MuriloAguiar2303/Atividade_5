import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DatabaseConnection } from '../../database/database';

const db = DatabaseConnection.getConnection();

export default function Cadastro() {
    const [nome, setNome] = useState('');
    const [dataNasc, setDataNasc] = useState('');
    const [telefone, setTelefone] = useState('');
    const navigation = useNavigation();

    const Cadastrar = () => {
        console.log("Dados do formulário:", nome, dataNasc, telefone);
        db.transaction(tx => {
            tx.executeSql(
                "INSERT INTO Clientes (nome, data_nasc) VALUES (?, ?)",
                [nome, dataNasc],
                (_, resultCliente) => {
                    console.log("Sucesso ao inserir cliente:", resultCliente);
                    const idCliente = resultCliente.insertId;

                    tx.executeSql(
                        "INSERT INTO Telefones (numero) VALUES (?)",
                        [telefone],
                        (_, resultTelefone) => {
                            console.log("Sucesso ao inserir telefone:", resultTelefone);
                            const idTelefone = resultTelefone.insertId;

                            tx.executeSql(
                                "INSERT INTO tbl_telefones_has_tbl_pessoa (id_telefone, id_pessoa) VALUES (?, ?)",
                                [idTelefone, idCliente],
                                (_, resultRelacao) => {
                                    console.log("Sucesso ao inserir relação:", resultRelacao);
                                    Alert.alert("Info", "Registro inserido com sucesso");
                                    setNome('');
                                    setDataNasc('');
                                    setTelefone('');
                                },
                                (error) => console.log("Erro ao inserir relação:", error)
                            );
                        },
                        (error) => console.log("Erro ao inserir telefone:", error)
                    );
                },
                (error) => console.log("Erro ao inserir cliente:", error)
            );
        });
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Nome"
                value={nome}
                onChangeText={text => setNome(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Data de Nascimento (DD/MM/YYYY)"
                value={dataNasc}
                onChangeText={text => setDataNasc(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Telefone"
                value={telefone}
                onChangeText={text => setTelefone(text)}
            />
            <TouchableOpacity style={styles.button} onPress={Cadastrar}>
                <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleGoBack}>
                <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 5,
        marginBottom: 10,
        width: '80%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});
