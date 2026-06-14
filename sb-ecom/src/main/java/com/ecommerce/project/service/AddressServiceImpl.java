package com.ecommerce.project.service;

import com.ecommerce.project.exception.ResourceNotFoundException;
import com.ecommerce.project.model.Address;
import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.AddressDTO;
import com.ecommerce.project.repository.AddressRepository;
import com.ecommerce.project.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public AddressDTO createAddress(AddressDTO addressDTO, User user) {
        Address address = modelMapper.map(addressDTO, Address.class);
        address.getUsers().add(user);
        user.getAddresses().add(address);
        Address saved = addressRepository.save(address);
        userRepository.save(user);
        return modelMapper.map(saved, AddressDTO.class);
    }

    @Override
    public List<AddressDTO> getAllAddresses() {
        return addressRepository.findAll().stream()
                .map(a -> modelMapper.map(a, AddressDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public AddressDTO getAddressById(Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId", addressId));
        return modelMapper.map(address, AddressDTO.class);
    }

    @Override
    public List<AddressDTO> getAddressesByUser(User user) {
        return user.getAddresses().stream()
                .map(a -> modelMapper.map(a, AddressDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public AddressDTO updateAddress(Long addressId, AddressDTO addressDTO) {
        Address existing = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId", addressId));
        existing.setStreet(addressDTO.getStreet());
        existing.setBuildingName(addressDTO.getBuildingName());
        existing.setCity(addressDTO.getCity());
        existing.setState(addressDTO.getState());
        existing.setCountry(addressDTO.getCountry());
        existing.setPincode(addressDTO.getPincode());
        Address saved = addressRepository.save(existing);
        return modelMapper.map(saved, AddressDTO.class);
    }

    @Override
    public String deleteAddress(Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId", addressId));
        address.getUsers().forEach(user -> user.getAddresses().remove(address));
        addressRepository.delete(address);
        return "Address with id " + addressId + " deleted.";
    }
}
