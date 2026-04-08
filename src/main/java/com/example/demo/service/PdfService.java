package com.example.demo.service;

import com.example.demo.entity.OrderEntity;
import com.example.demo.model.CartItem;
import com.itextpdf.html2pdf.HtmlConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class PdfService {

    @Autowired
    private TemplateEngine templateEngine;

    public byte[] generateOrderPdf(OrderEntity order, List<CartItem> items, double shipping) {
        try {
            // Create Thymeleaf context and add variables
            Context context = new Context();
            context.setVariable("order", order);
            context.setVariable("items", items);
            context.setVariable("shipping", shipping);
            context.setVariable("subtotal", items.stream()
                    .mapToDouble(i -> i.getPrice() * i.getQuantity())
                    .sum());

            // Process the HTML template
            String htmlContent = templateEngine.process("invoice-pdf", context);

            // Convert HTML to PDF
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            HtmlConverter.convertToPdf(htmlContent, outputStream);

            return outputStream.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            return new byte[0];
        }
    }
}