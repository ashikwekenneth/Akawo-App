import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, ChevronLeft, MapPin, Trash2, Edit } from 'lucide-react';
import { Address, AddressType } from '@/types';

const AddressesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Normally we would fetch these from an API
  const [addresses, setAddresses] = useState<Address[]>([
    {
      _id: 'addr-1',
      userId: user?._id || '',
      addressType: 'shipping',
      isDefault: true,
      fullName: `${user?.firstName} ${user?.lastName}`,
      addressLine1: '123 Main Street',
      addressLine2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States',
      phoneNumber: '123-456-7890',
      deliveryInstructions: 'Please leave at the door'
    },
    {
      _id: 'addr-2',
      userId: user?._id || '',
      addressType: 'billing',
      isDefault: true,
      fullName: `${user?.firstName} ${user?.lastName}`,
      addressLine1: '123 Main Street',
      addressLine2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States',
      phoneNumber: '123-456-7890'
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Address>>({
    addressType: 'shipping',
    isDefault: false,
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phoneNumber: '',
    deliveryInstructions: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const resetForm = () => {
    setFormData({
      addressType: 'shipping',
      isDefault: false,
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phoneNumber: '',
      deliveryInstructions: ''
    });
  };

  const handleAddressEdit = (address: Address) => {
    setCurrentAddress(address);
    setFormData({
      ...address
    });
    setIsEditDialogOpen(true);
  };

  const handleAddressDelete = (address: Address) => {
    setCurrentAddress(address);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, addressType: value as AddressType }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app, this would make an API call
      const newAddress: Address = {
        _id: `addr-${Math.random().toString(36).substring(2, 9)}`,
        userId: user?._id || '',
        addressType: formData.addressType as AddressType,
        isDefault: Boolean(formData.isDefault),
        fullName: formData.fullName || '',
        addressLine1: formData.addressLine1 || '',
        addressLine2: formData.addressLine2,
        city: formData.city || '',
        state: formData.state || '',
        postalCode: formData.postalCode || '',
        country: formData.country || '',
        phoneNumber: formData.phoneNumber || '',
        deliveryInstructions: formData.deliveryInstructions
      };

      // If this is set as default, update other addresses of same type
      if (newAddress.isDefault) {
        setAddresses(prev => prev.map(addr => {
          if (addr.addressType === newAddress.addressType) {
            return { ...addr, isDefault: false };
          }
          return addr;
        }));
      }

      setAddresses(prev => [...prev, newAddress]);
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAddress) return;
    
    setIsLoading(true);
    
    try {
      // In a real app, this would make an API call
      const updatedAddress: Address = {
        ...currentAddress,
        addressType: formData.addressType as AddressType,
        isDefault: Boolean(formData.isDefault),
        fullName: formData.fullName || '',
        addressLine1: formData.addressLine1 || '',
        addressLine2: formData.addressLine2,
        city: formData.city || '',
        state: formData.state || '',
        postalCode: formData.postalCode || '',
        country: formData.country || '',
        phoneNumber: formData.phoneNumber || '',
        deliveryInstructions: formData.deliveryInstructions
      };

      // If this is set as default, update other addresses of same type
      if (updatedAddress.isDefault) {
        setAddresses(prev => prev.map(addr => {
          if (addr._id !== updatedAddress._id && addr.addressType === updatedAddress.addressType) {
            return { ...addr, isDefault: false };
          }
          return addr;
        }));
      }

      setAddresses(prev => 
        prev.map(addr => addr._id === updatedAddress._id ? updatedAddress : addr)
      );
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async () => {
    if (!currentAddress) return;
    
    setIsLoading(true);
    
    try {
      // In a real app, this would make an API call
      setAddresses(prev => prev.filter(addr => addr._id !== currentAddress._id));
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const shippingAddresses = addresses.filter(addr => addr.addressType === 'shipping');
  const billingAddresses = addresses.filter(addr => addr.addressType === 'billing');

  const AddressCard = ({ address }: { address: Address }) => {
    return (
      <Card className="relative">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{address.fullName}</CardTitle>
              {address.isDefault && (
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  Default
                </span>
              )}
            </div>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleAddressEdit(address)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleAddressDelete(address)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            {address.addressType === 'shipping' ? 'Shipping Address' : 'Billing Address'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-sm">
            <p>{address.addressLine1}</p>
            {address.addressLine2 && <p>{address.addressLine2}</p>}
            <p>
              {address.city}, {address.state} {address.postalCode}
            </p>
            <p>{address.country}</p>
            <p className="mt-1">Phone: {address.phoneNumber}</p>
            {address.deliveryInstructions && (
              <p className="mt-1 text-muted-foreground">
                Note: {address.deliveryInstructions}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-1 -ml-4" 
          onClick={() => navigate('/account')}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Account
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">My Addresses</h1>
            <p className="text-muted-foreground mt-1">
              Manage your shipping and billing addresses
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0">Add New Address</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
                <DialogDescription>
                  Add a new shipping or billing address to your account.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddAddress}>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="addressType">Address Type</Label>
                    <RadioGroup 
                      defaultValue="shipping" 
                      value={formData.addressType} 
                      onValueChange={handleRadioChange}
                      className="flex flex-row space-x-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="shipping" id="shipping" />
                        <Label htmlFor="shipping">Shipping</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="billing" id="billing" />
                        <Label htmlFor="billing">Billing</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isDefault"
                        name="isDefault"
                        checked={Boolean(formData.isDefault)}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="isDefault">
                        Set as default {formData.addressType === 'shipping' ? 'shipping' : 'billing'} address
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressLine1">Address Line 1</Label>
                    <Input
                      id="addressLine1"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                    <Input
                      id="addressLine2"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) => handleSelectChange('country', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="Germany">Germany</SelectItem>
                          <SelectItem value="France">France</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                          <SelectItem value="Nigeria">Nigeria</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {formData.addressType === 'shipping' && (
                    <div className="space-y-2">
                      <Label htmlFor="deliveryInstructions">Delivery Instructions (Optional)</Label>
                      <Textarea
                        id="deliveryInstructions"
                        name="deliveryInstructions"
                        value={formData.deliveryInstructions || ''}
                        onChange={handleInputChange}
                        placeholder="Special instructions for delivery"
                      />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => {
                      resetForm();
                      setIsAddDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add Address"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Shipping Addresses
            </h2>
            
            {shippingAddresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {shippingAddresses.map(address => (
                  <AddressCard key={address._id} address={address} />
                ))}
              </div>
            ) : (
              <Card className="bg-gray-50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground mb-4">You don't have any shipping addresses yet</p>
                  <DialogTrigger asChild>
                    <Button variant="secondary" onClick={() => {
                      resetForm();
                      setFormData(prev => ({ ...prev, addressType: 'shipping' }));
                      setIsAddDialogOpen(true);
                    }}>
                      Add Shipping Address
                    </Button>
                  </DialogTrigger>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Billing Addresses
            </h2>
            
            {billingAddresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {billingAddresses.map(address => (
                  <AddressCard key={address._id} address={address} />
                ))}
              </div>
            ) : (
              <Card className="bg-gray-50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground mb-4">You don't have any billing addresses yet</p>
                  <Button variant="secondary" onClick={() => {
                    resetForm();
                    setFormData(prev => ({ ...prev, addressType: 'billing' }));
                    setIsAddDialogOpen(true);
                  }}>
                    Add Billing Address
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Edit Address Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Address</DialogTitle>
              <DialogDescription>
                Update your address information.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateAddress}>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-addressType">Address Type</Label>
                  <RadioGroup 
                    value={formData.addressType} 
                    onValueChange={handleRadioChange}
                    className="flex flex-row space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="shipping" id="edit-shipping" />
                      <Label htmlFor="edit-shipping">Shipping</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="billing" id="edit-billing" />
                      <Label htmlFor="edit-billing">Billing</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-isDefault"
                      name="isDefault"
                      checked={Boolean(formData.isDefault)}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="edit-isDefault">
                      Set as default {formData.addressType === 'shipping' ? 'shipping' : 'billing'} address
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-fullName">Full Name</Label>
                  <Input
                    id="edit-fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-addressLine1">Address Line 1</Label>
                  <Input
                    id="edit-addressLine1"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-addressLine2">Address Line 2 (Optional)</Label>
                  <Input
                    id="edit-addressLine2"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="edit-city">City</Label>
                    <Input
                      id="edit-city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-state">State/Province</Label>
                    <Input
                      id="edit-state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="edit-postalCode">Postal Code</Label>
                    <Input
                      id="edit-postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-country">Country</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => handleSelectChange('country', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="Germany">Germany</SelectItem>
                        <SelectItem value="France">France</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                        <SelectItem value="Nigeria">Nigeria</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-phoneNumber">Phone Number</Label>
                  <Input
                    id="edit-phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {formData.addressType === 'shipping' && (
                  <div className="space-y-2">
                    <Label htmlFor="edit-deliveryInstructions">Delivery Instructions (Optional)</Label>
                    <Textarea
                      id="edit-deliveryInstructions"
                      name="deliveryInstructions"
                      value={formData.deliveryInstructions || ''}
                      onChange={handleInputChange}
                      placeholder="Special instructions for delivery"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Address"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Address Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Delete Address</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this address? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteAddress} 
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete Address"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AddressesPage;