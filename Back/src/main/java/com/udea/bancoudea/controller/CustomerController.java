package com.udea.bancoudea.controller;

import com.udea.bancoudea.DTO.CustomerDTO;
import com.udea.bancoudea.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    private final CustomerService customerFacade;

    public CustomerController(CustomerService customerFacade) {
        this.customerFacade = customerFacade;
    }

    //Obtener todos los cliente
    @GetMapping
    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
        return ResponseEntity.ok(customerFacade.getAllCustomer());
    }

    //Obtener un cliente por su numero de cuenta
    @GetMapping("/account/{accountNumber}")
    public ResponseEntity<CustomerDTO> getCustomerByAccountNumber(@PathVariable String accountNumber) {
        return ResponseEntity.ok(customerFacade.getCustomerByAccountNumber(accountNumber));
    }

    //Obtener un cliente por su numero de ID
    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable Long id) {
        return ResponseEntity.ok(customerFacade.getCustomerById(id));
    }

    //creacion de un cliente
    @PostMapping
    public ResponseEntity<Object> createCustomer(@RequestBody CustomerDTO customerDTO) {
        CustomerDTO newCustomerDTO = customerFacade.createCustomer(customerDTO);
        return ResponseEntity.ok("Usted es el cliente con ID:" + newCustomerDTO.getId()+" su cuenta es : " + newCustomerDTO.getAccountNumber() + " y su saldo es: " + newCustomerDTO.getBalance());
    }

   //eliminar un cliente
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCustomer(@PathVariable Long id) {
        customerFacade.deleteCustomer(id);
        return ResponseEntity.ok("Cliente eliminado con éxito");
    }

    //Actualizar un cliente
    @PutMapping("/{id}")
    public ResponseEntity<CustomerDTO> updateCustomer(@PathVariable Long id, @RequestBody CustomerDTO customerDTO) {
        return ResponseEntity.ok(customerFacade.updateCustomer(id, customerDTO));
    }


}
