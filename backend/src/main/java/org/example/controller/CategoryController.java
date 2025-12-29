package org.example.controller;
import org.example.service.interf.CategoryService;
import org.example.dto.CategoryDto;
import org.example.dto.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping("/create")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_ADMIN')")
    public ResponseEntity<Response> createCategory(@RequestBody CategoryDto categoryDto){
        return ResponseEntity.ok(categoryService.createCategory(categoryDto));
    }

    @GetMapping("/get-all")
    public ResponseEntity<Response> getAllCategories(){
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PutMapping("/update/{categoryId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_ADMIN')")
    public ResponseEntity<Response> updateCategory(@PathVariable Long categoryId, @RequestBody CategoryDto categoryDto){
        return ResponseEntity.ok(categoryService.updateCategory(categoryId, categoryDto));
    }

    @DeleteMapping("/delete/{categoryId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_ADMIN')")
    public ResponseEntity<Response> deleteCategory(@PathVariable Long categoryId){
        return ResponseEntity.ok(categoryService.deleteCategory(categoryId));
    }

    @GetMapping("/get-category-by-id/{categoryId}")
    public ResponseEntity<Response> getCategoryById(@PathVariable Long categoryId){
        return ResponseEntity.ok(categoryService.getCategoryById(categoryId));
    }


}