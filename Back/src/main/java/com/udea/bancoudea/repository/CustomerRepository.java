package com.udea.bancoudea.repository;

import com.udea.bancoudea.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByAccountNumber(String accountNumber);
    boolean existsByAccountNumber(String accountNumber);
    @Query("SELECT MAX(c.accountNumber) FROM Customer c")
    int findMaxAccountNumber();
}
