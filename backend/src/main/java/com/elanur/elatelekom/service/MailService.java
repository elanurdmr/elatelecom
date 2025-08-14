package com.elanur.elatelekom.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private final JavaMailSender mailSender;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendMail(String to, String subject, String text) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject(subject);
        msg.setText(text);
        mailSender.send(msg);
    }

    public void sendVerificationEmail(String email, String token) {
        String subject = "Email Verification - ElaTelekom";
        String text = String.format(
            "Thank you for registering with ElaTelekom!\n\n" +
            "Please click the following link to verify your email address:\n" +
            "http://localhost:3000/verify-email?token=%s\n\n" +
            "This link will expire in 24 hours.\n\n" +
            "If you didn't create an account, please ignore this email.\n\n" +
            "Best regards,\nElaTelekom Team",
            token
        );
        sendMail(email, subject, text);
    }
}
