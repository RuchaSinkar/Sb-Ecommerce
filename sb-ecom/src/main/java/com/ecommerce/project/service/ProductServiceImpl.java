package com.ecommerce.project.service;

import com.ecommerce.project.exception.APIException;
import com.ecommerce.project.exception.ResourceNotFoundException;
import com.ecommerce.project.model.Category;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.payload.ProductDTO;
import com.ecommerce.project.payload.ProductResponse;
import com.ecommerce.project.repository.CategoryRepository;
import com.ecommerce.project.repository.ProductRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService{

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private FileService fileService;

    @Value("${project.image}")
    private String path;
    @Override
    @Caching(evict = {
            @CacheEvict(value = "products", allEntries = true),
            @CacheEvict(value = "productsByCategory", allEntries = true)
    })
    public ProductDTO addProduct(Long categoryId, ProductDTO productDTO){

        Category category=categoryRepository.findById(categoryId)
                .orElseThrow(()->new ResourceNotFoundException("Category","categoryId",categoryId));
        boolean isProductNotPresent=true;
        List<Product> products=category.getProducts();
        for (Product value : products) {
            if (value.getProductName().equals(productDTO.getProductName())) {
                isProductNotPresent = false;
                break;
            }
        }
        if (isProductNotPresent){
            Product product=modelMapper.map(productDTO,Product.class);
            product.setCategory(category);
            product.setImage("default.png");
            double specialPrice=product.getPrice()-((product.getDiscount()/100)* product.getPrice());
            product.setSpecialPrice(specialPrice);
            Product savedProduct=productRepository.save(product);
            return modelMapper.map(savedProduct, ProductDTO.class);
        }
        else {
            throw new APIException("Product already exists");
        }
    }

    @Override
    @Cacheable(value = "products",
    key = "#pageNumber + '-' + #pageSize + '-' +#sortBy + '-' + #sortOrder")
    public ProductResponse getAllProducts(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder){
        Sort sortByAndOrder=sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageDetails= PageRequest.of(pageNumber,pageSize,sortByAndOrder);
        Page<Product> pageProducts=productRepository.findAll(pageDetails);
        List<Product> products=pageProducts.getContent();
        List<ProductDTO> productDTOS=products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .toList();
        //if(products.isEmpty()) throw new APIException("No products found");
        ProductResponse productResponse=new ProductResponse();
        productResponse.setContent(productDTOS);
        productResponse.setPageNumber(pageProducts.getNumber());
        productResponse.setPageSize(pageProducts.getSize());
        productResponse.setTotalPages(pageProducts.getTotalPages());
        productResponse.setTotalElements(pageProducts.getTotalElements());
        productResponse.setLastPage(pageProducts.isLast());
        return productResponse;
    }

    @Override
    @Cacheable(value = "productsByCategory",
    key = "#categoryId + '-' + #pageNumber + '-' + #pageSize + '-' + #sortBy + '-' + #sortOrder")
    public ProductResponse searchByCategory(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder, Long categoryId){
        Category category=categoryRepository.findById(categoryId)
                .orElseThrow(()-> new ResourceNotFoundException("Category","category",categoryId));
        Sort sortByAndOrder=sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageDetails= PageRequest.of(pageNumber,pageSize,sortByAndOrder);
        Page<Product> pageProducts=productRepository.findByCategoryOrderByPriceAsc(category,pageDetails);
        List<Product> products=pageProducts.getContent();
        List<ProductDTO> productDTOS=products.stream()
                .map(product -> modelMapper.map(product,ProductDTO.class))
                .toList();
        if(products.isEmpty()) throw new APIException(category.getCategoryName()+" category name doesnot have product");
        ProductResponse productResponse=new ProductResponse();
        productResponse.setContent(productDTOS);
        productResponse.setPageNumber(pageProducts.getNumber());
        productResponse.setPageSize(pageProducts.getSize());
        productResponse.setTotalPages(pageProducts.getTotalPages());
        productResponse.setTotalElements(pageProducts.getTotalElements());
        productResponse.setLastPage(pageProducts.isLast());
        return productResponse;
    }

    @Override
    @Cacheable(value = "productSearch",
    key = "#keyword + '-' + #pageNumber + '-' + #pageSize")
    public ProductResponse searchProductsByKeyword(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder,String keyword){
        Sort sortByAndOrder=sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageDetails= PageRequest.of(pageNumber,pageSize,sortByAndOrder);
        Page<Product> pageProducts=productRepository.findByProductNameLikeIgnoreCase('%'+keyword+'%',pageDetails);
        List<Product> products=pageProducts.getContent();
        List<ProductDTO> productDTOS=products.stream()
                .map(product -> modelMapper.map(product,ProductDTO.class))
                .toList();
        if(products.isEmpty()) throw new APIException("Products not found with keyword: "+keyword);
        ProductResponse productResponse=new ProductResponse();
        productResponse.setContent(productDTOS);
        productResponse.setPageNumber(pageProducts.getNumber());
        productResponse.setPageSize(pageProducts.getSize());
        productResponse.setTotalPages(pageProducts.getTotalPages());
        productResponse.setTotalElements(pageProducts.getTotalElements());
        productResponse.setLastPage(pageProducts.isLast());
        return productResponse;    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "products", allEntries = true),
            @CacheEvict(value = "productsByCategory", allEntries = true),
            @CacheEvict(value = "productSearch", allEntries = true),
            @CacheEvict(value = "product", key = "#productId")
    })
    public ProductDTO updateProduct(Long productId, ProductDTO productDTO){
        Product product=modelMapper.map(productDTO,Product.class);
        Product productfromDb=productRepository.findById(productId)
                .orElseThrow(()->new ResourceNotFoundException("Product","productId",productId));
        productfromDb.setProductName(product.getProductName());
        productfromDb.setDescription(product.getDescription());
        productfromDb.setQuantity(product.getQuantity());
        productfromDb.setPrice(product.getPrice());
        productfromDb.setDiscount(product.getDiscount());
        double specialPrice=product.getPrice()-((product.getDiscount()/100)* product.getPrice());
        productfromDb.setSpecialPrice(specialPrice);
        Product savedProduct=productRepository.save(productfromDb);
        return modelMapper.map(savedProduct,ProductDTO.class);
    }

    @Override
    @Caching(evict ={
            @CacheEvict(value = "products",          allEntries = true),
            @CacheEvict(value = "productsByCategory", allEntries = true),
            @CacheEvict(value = "productSearch",      allEntries = true),
            @CacheEvict(value = "product",            key = "#productId")
    })
    public ProductDTO deleteProduct(Long productId) {
        Product findProduct = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
        productRepository.delete(findProduct);
        return modelMapper.map(findProduct,ProductDTO.class);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "products", allEntries = true),
            @CacheEvict(value = "product",  key = "#productId")
    })
    public ProductDTO updateProductImage(Long productId, MultipartFile image) throws IOException {
        Product productFromDB=productRepository.findById(productId)
                .orElseThrow(()->new ResourceNotFoundException("Product","productId",productId));
        String filename=fileService.uploadImage(path,image);
        productFromDB.setImage(filename);
        Product updatedProduct=productRepository.save(productFromDB);
        return modelMapper.map(updatedProduct,ProductDTO.class);
    }
}
