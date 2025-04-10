package com.udea.bancoudea.service;

import com.udea.bancoudea.DTO.CustomerDTO;
import com.udea.bancoudea.entity.Customer;
import com.udea.bancoudea.mapper.CustomerMapper;
import com.udea.bancoudea.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    @Autowired
    public CustomerService(CustomerRepository customerRepository, CustomerMapper customerMapper) {
        this.customerRepository = customerRepository;
        this.customerMapper = customerMapper;
    }

    public List<CustomerDTO> getAllCustomer(){
        return customerRepository.findAll().stream()
                .map(customerMapper::toDTO).toList();
    }

    public CustomerDTO getCustomerById(Long id){
        return customerRepository.findById(id).map(customerMapper::toDTO)
                .orElseThrow(()->new RuntimeException("Cliente no encontrado"));
    }

    public CustomerDTO createCustomer(CustomerDTO customerDTO){
        Customer customer = customerMapper.toEntity(customerDTO);

        // Obtener el máximo accountNumber actual de forma segura
        List<Customer> allCustomers = customerRepository.findAll();
        int maxAccountNumber = allCustomers.stream()
                .mapToInt(c -> {
                    try {
                        return Integer.parseInt(c.getAccountNumber());
                    } catch (NumberFormatException e) {
                        return 0; // En caso de que alguna cuenta no sea numérica
                    }
                })
                .max()
                .orElse(1000); // Si no hay cuentas, comenzar desde 1000

        customer.setAccountNumber(String.valueOf(maxAccountNumber + 1));
        Customer savedCustomer = customerRepository.save(customer);
        return customerMapper.toDTO(savedCustomer);
    }

    public CustomerDTO getCustomerByAccountNumber(String accountNumber){
        return customerRepository.findByAccountNumber(accountNumber).map(customerMapper::toDTO)
                .orElseThrow(()->new RuntimeException("El Numero de cuenta "+ accountNumber + " no encontrado"));
    }

    public boolean existsAccount(String accountNumber) {
        // Verificar si la cuenta existe en la base de datos
        return customerRepository.existsByAccountNumber(accountNumber);
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }

    public CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO) {
        Customer customer = customerRepository.findById(id).
                orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        customer.setFirstName(customerDTO.getFirstName());
        customer.setLastName(customerDTO.getLastName());
        customer.setBalance(customerDTO.getBalance());
        Customer updatedCustomer = customerRepository.save(customer);
        return customerMapper.toDTO(updatedCustomer);
    }

}
