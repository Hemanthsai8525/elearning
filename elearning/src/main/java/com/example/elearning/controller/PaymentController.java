package com.example.elearning.controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.elearning.service.PaymentService;
@RestController
@RequestMapping("/api/payments")
public class PaymentController {
	private final PaymentService service;
	public PaymentController(PaymentService service) {
		this.service = service;
	}
	@PostMapping("/pay/{courseId}")
	public String pay(@PathVariable Long courseId) {
		service.mockPay(courseId);
		return "Payment Successful";
	}
}
