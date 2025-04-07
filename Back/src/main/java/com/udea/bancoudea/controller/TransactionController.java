package com.udea.bancoudea.controller;

import com.udea.bancoudea.DTO.CustomerDTO;
import com.udea.bancoudea.DTO.TransactionDTO;

import com.udea.bancoudea.entity.Transaction;
import com.udea.bancoudea.service.CustomerService;
import com.udea.bancoudea.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    @Autowired
    private CustomerService customerService;

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/transfer")
    public ResponseEntity<TransactionDTO> transferMoney(@RequestBody TransactionDTO transactionDTO) {
        // Obtener los clientes por número de cuenta
        CustomerDTO sender = customerService.getCustomerByAccountNumber(transactionDTO.getSenderAccountNumber());
        CustomerDTO receiver = customerService.getCustomerByAccountNumber(transactionDTO.getReceiverAccountNumber());

        // Validar que los clientes existan y tengan saldo suficiente
        if (sender == null || receiver == null) {
            throw new IllegalArgumentException("No se encontro alguna de las cuentas");
        }
        if (sender.getBalance() < transactionDTO.getAmount()) {
            throw new IllegalArgumentException("Fondos insuficientes");
        }

        // Realizar la transacción
        transactionDTO.setTimestamp(LocalDateTime.now());
        TransactionDTO result = transactionService.transferMoney(transactionDTO);
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public Transaction createTransaction(@RequestBody TransactionDTO transactionDTO) {
        Transaction transaction = transactionService.createTransaction(transactionDTO);
        transaction.setTimestamp(LocalDateTime.now()); // Establecer el valor de timestamp
        return transaction;
    }

    @GetMapping("/account/{accountNumber}")
    public ResponseEntity<Object> getTransactionsForAccount(@PathVariable String accountNumber) {
        if (!customerService.existsAccount(accountNumber)) {
            return ResponseEntity.badRequest().body("La cuenta " + accountNumber + " no existe");
        }

        // Si la cuenta existe, hacer la consulta de transacciones
        List<TransactionDTO> transactions = transactionService.getTransactionsForAccount(accountNumber);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }
}

