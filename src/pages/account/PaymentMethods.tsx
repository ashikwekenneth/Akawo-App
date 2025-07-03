import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChevronLeft, CreditCard, Trash2, AlertCircle } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'paypal';
  isDefault: boolean;
  cardName?: string;
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cardBrand?: string;
  paypalEmail?: string;
}

const PaymentMethodsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data - in a real app, this would be fetched from an API
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'pm-1',
      type: 'credit_card',
      isDefault: true,
      cardName: 'John Doe',
      cardNumber: '•••• •••• •••• 4242',
      expiryMonth: '12',
      expiryYear: '2024',
      cardBrand: 'visa'
    },
    {
      id: 'pm-2',
      type: 'paypal',
      isDefault: false,
      paypalEmail: 'john.doe@example.com'
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentType, setPaymentType] = useState<'credit_card' | 'paypal'>('credit_card');
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    isDefault: false,
    paypalEmail: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const resetForm = () => {
    setFormData({
      cardName: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      isDefault: false,
      paypalEmail: ''
    });
    setPaymentType('credit_card');
    setFormError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handlePaymentDelete = (paymentMethod: PaymentMethod) => {
    setCurrentPaymentMethod(paymentMethod);
    setIsDeleteDialogOpen(true);
  };

  const handleSetDefault = (paymentMethodId: string) => {
    setPaymentMethods(prev => prev.map(pm => ({
      ...pm,
      isDefault: pm.id === paymentMethodId
    })));
  };

  const validateForm = () => {
    if (paymentType === 'credit_card') {
      if (!formData.cardName || !formData.cardNumber || !formData.expiryMonth || !formData.expiryYear || !formData.cvv) {
        setFormError('All fields are required');
        return false;
      }
      
      // Very basic validation
      if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
        setFormError('Invalid card number');
        return false;
      }
      
      if (formData.cvv.length < 3) {
        setFormError('Invalid CVV');
        return false;
      }
    } else if (paymentType === 'paypal') {
      if (!formData.paypalEmail) {
        setFormError('PayPal email is required');
        return false;
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.paypalEmail)) {
        setFormError('Invalid email format');
        return false;
      }
    }
    
    setFormError('');
    return true;
  };

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would make an API call to a payment processor
      // For the mock, we're just creating a local object
      
      let newPaymentMethod: PaymentMethod;
      
      if (paymentType === 'credit_card') {
        // Mask the card number except last 4 digits
        const maskedNumber = '•••• •••• •••• ' + formData.cardNumber.slice(-4);
        
        newPaymentMethod = {
          id: `pm-${Math.random().toString(36).substring(2, 9)}`,
          type: 'credit_card',
          isDefault: formData.isDefault,
          cardName: formData.cardName,
          cardNumber: maskedNumber,
          expiryMonth: formData.expiryMonth,
          expiryYear: formData.expiryYear,
          cardBrand: 'visa' // In a real app, this would be determined from the card number
        };
      } else {
        newPaymentMethod = {
          id: `pm-${Math.random().toString(36).substring(2, 9)}`,
          type: 'paypal',
          isDefault: formData.isDefault,
          paypalEmail: formData.paypalEmail
        };
      }
      
      // If this is set as default, update other payment methods
      if (formData.isDefault) {
        setPaymentMethods(prev => prev.map(pm => ({ ...pm, isDefault: false })));
      }
      
      setPaymentMethods(prev => [...prev, newPaymentMethod]);
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding payment method:', error);
      setFormError('Failed to add payment method. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePaymentMethod = async () => {
    if (!currentPaymentMethod) return;
    
    setIsLoading(true);
    
    try {
      // In a real app, this would make an API call
      setPaymentMethods(prev => {
        const updatedMethods = prev.filter(pm => pm.id !== currentPaymentMethod.id);
        
        // If we're deleting the default payment method and there are other methods,
        // set the first remaining one as default
        if (currentPaymentMethod.isDefault && updatedMethods.length > 0) {
          updatedMethods[0].isDefault = true;
        }
        
        return updatedMethods;
      });
      
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting payment method:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCardBrand = (brand: string) => {
    return brand.charAt(0).toUpperCase() + brand.slice(1);
  };

  const PaymentMethodCard = ({ paymentMethod }: { paymentMethod: PaymentMethod }) => {
    if (paymentMethod.type === 'credit_card') {
      return (
        <Card className="relative">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">
                    {formatCardBrand(paymentMethod.cardBrand || 'Card')}
                  </CardTitle>
                  {paymentMethod.isDefault && (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      Default
                    </span>
                  )}
                </div>
                <CardDescription className="mt-1">
                  {paymentMethod.cardName}
                </CardDescription>
              </div>
              <div className="flex gap-1">
                {!paymentMethod.isDefault && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleSetDefault(paymentMethod.id)}
                  >
                    Set Default
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handlePaymentDelete(paymentMethod)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <p className="font-mono">{paymentMethod.cardNumber}</p>
              <p className="text-muted-foreground mt-1">
                Expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
              </p>
            </div>
          </CardContent>
        </Card>
      );
    } else {
      return (
        <Card className="relative">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">PayPal</CardTitle>
                  {paymentMethod.isDefault && (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      Default
                    </span>
                  )}
                </div>
                <CardDescription className="mt-1">
                  {paymentMethod.paypalEmail}
                </CardDescription>
              </div>
              <div className="flex gap-1">
                {!paymentMethod.isDefault && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleSetDefault(paymentMethod.id)}
                  >
                    Set Default
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handlePaymentDelete(paymentMethod)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      );
    }
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
            <h1 className="text-2xl font-bold">Payment Methods</h1>
            <p className="text-muted-foreground mt-1">
              Manage your saved payment methods
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0">Add Payment Method</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
                <DialogDescription>
                  Add a new credit card or PayPal account to your account.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddPaymentMethod}>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label>Payment Type</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        type="button"
                        variant={paymentType === 'credit_card' ? 'default' : 'outline'}
                        className="w-full flex items-center gap-2 justify-center"
                        onClick={() => setPaymentType('credit_card')}
                      >
                        <CreditCard className="h-4 w-4" />
                        Credit Card
                      </Button>
                      <Button
                        type="button"
                        variant={paymentType === 'paypal' ? 'default' : 'outline'}
                        className="w-full flex items-center gap-2 justify-center"
                        onClick={() => setPaymentType('paypal')}
                      >
                        <span className="font-bold">P</span>
                        PayPal
                      </Button>
                    </div>
                  </div>

                  {formError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        {formError}
                      </AlertDescription>
                    </Alert>
                  )}

                  {paymentType === 'credit_card' ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          placeholder="Name on card"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <div className="flex gap-2">
                            <Select
                              value={formData.expiryMonth}
                              onValueChange={(value) => setFormData(prev => ({ ...prev, expiryMonth: value }))}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="MM" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 12 }, (_, i) => {
                                  const month = (i + 1).toString().padStart(2, '0');
                                  return (
                                    <SelectItem key={month} value={month}>
                                      {month}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <Select
                              value={formData.expiryYear}
                              onValueChange={(value) => setFormData(prev => ({ ...prev, expiryYear: value }))}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="YY" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 10 }, (_, i) => {
                                  const year = (new Date().getFullYear() + i).toString();
                                  return (
                                    <SelectItem key={year} value={year}>
                                      {year}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="paypalEmail">PayPal Email</Label>
                      <Input
                        id="paypalEmail"
                        name="paypalEmail"
                        type="email"
                        value={formData.paypalEmail}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="isDefault">Set as default payment method</Label>
                  </div>

                  {paymentType === 'credit_card' && (
                    <p className="text-xs text-muted-foreground">
                      Your card information is securely processed and stored by our payment provider.
                      We never store your full card details on our servers.
                    </p>
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
                    {isLoading ? "Adding..." : "Add Payment Method"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          {paymentMethods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paymentMethods.map(paymentMethod => (
                <PaymentMethodCard key={paymentMethod.id} paymentMethod={paymentMethod} />
              ))}
            </div>
          ) : (
            <Card className="bg-gray-50 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground mb-4">You don't have any payment methods yet</p>
                <DialogTrigger asChild>
                  <Button variant="secondary">Add Payment Method</Button>
                </DialogTrigger>
              </CardContent>
            </Card>
          )}

          <div className="border-t pt-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">About Payment Security</h2>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Akawo uses industry-standard encryption to protect your payment information. Your payment details are never stored on our servers and are securely processed by our payment providers.
              </p>
              <p className="text-sm text-muted-foreground">
                We support various payment methods including credit/debit cards and PayPal to ensure a secure and convenient shopping experience.
              </p>
            </div>
          </div>
        </div>

        {/* Delete Payment Method Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Delete Payment Method</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this payment method? This action cannot be undone.
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
                onClick={handleDeletePaymentMethod} 
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete Payment Method"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PaymentMethodsPage;