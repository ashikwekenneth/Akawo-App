import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, Bell, Check } from 'lucide-react';
import { NotificationType } from '@/types';

interface NotificationPreference {
  type: NotificationType;
  title: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

const NotificationsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // Mock notification preferences - in a real app, this would be fetched from an API
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      type: 'order_status',
      title: 'Order Status Updates',
      description: 'Notifications about your orders, including confirmation, shipping, and delivery',
      email: true,
      push: true,
      sms: false
    },
    {
      type: 'shipping_update',
      title: 'Shipping Updates',
      description: 'Get notifications when your order ships and delivery status changes',
      email: true,
      push: true,
      sms: false
    },
    {
      type: 'payment_confirmation',
      title: 'Payment Confirmations',
      description: 'Receive receipts and payment confirmations',
      email: true,
      push: false,
      sms: false
    },
    {
      type: 'restock',
      title: 'Back in Stock',
      description: 'Get notified when products you\'re interested in are back in stock',
      email: false,
      push: true,
      sms: false
    },
    {
      type: 'price_drop',
      title: 'Price Drops',
      description: 'Alerts when prices drop on products you\'ve viewed or saved',
      email: false,
      push: true,
      sms: false
    },
    {
      type: 'promotion',
      title: 'Promotions & Offers',
      description: 'Sales, discounts, and special offers on products you might like',
      email: false,
      push: false,
      sms: false
    },
    {
      type: 'recommendation',
      title: 'Product Recommendations',
      description: 'Personalized product recommendations based on your interests',
      email: false,
      push: false,
      sms: false
    },
    {
      type: 'review_request',
      title: 'Review Requests',
      description: 'Reminders to review products you\'ve purchased',
      email: true,
      push: false,
      sms: false
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'email' | 'push' | 'sms'>('all');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleToggle = (index: number, channel: 'email' | 'push' | 'sms', value: boolean) => {
    setPreferences(prev => prev.map((pref, i) => {
      if (i === index) {
        return { ...pref, [channel]: value };
      }
      return pref;
    }));
  };

  const handleToggleAll = (channel: 'email' | 'push' | 'sms', value: boolean) => {
    setPreferences(prev => prev.map(pref => ({ ...pref, [channel]: value })));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, this would make an API call to update notification preferences
      // For now, we'll just simulate a successful update
      
      // We'd also update the user's profile notification preferences
      if (user) {
        await updateUser({
          preferences: {
            ...user.preferences,
            notifications: {
              email: preferences.some(p => p.email),
              push: preferences.some(p => p.push),
              sms: preferences.some(p => p.sms)
            }
          }
        });
      }
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving notification preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate if all notifications of a specific type are enabled/disabled
  const allEmail = preferences.every(pref => pref.email);
  const anyEmail = preferences.some(pref => pref.email);
  const allPush = preferences.every(pref => pref.push);
  const anyPush = preferences.some(pref => pref.push);
  const allSms = preferences.every(pref => pref.sms);
  const anySms = preferences.some(pref => pref.sms);

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
            <h1 className="text-2xl font-bold">Notification Preferences</h1>
            <p className="text-muted-foreground mt-1">
              Choose how and when you want to hear from us
            </p>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as 'all' | 'email' | 'push' | 'sms')} className="w-full mb-8">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="all">All Notifications</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="push">Push</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
          </TabsList>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Channel toggle controls */}
                <div className="flex flex-wrap gap-4 justify-between items-center pb-4 border-b">
                  {selectedTab === 'all' && (
                    <>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch 
                            id="toggle-all-email" 
                            checked={allEmail} 
                            onCheckedChange={(checked) => handleToggleAll('email', checked)}
                          />
                          <Label htmlFor="toggle-all-email">Email {allEmail ? 'All' : anyEmail ? 'Some' : 'None'}</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch 
                            id="toggle-all-push" 
                            checked={allPush} 
                            onCheckedChange={(checked) => handleToggleAll('push', checked)}
                          />
                          <Label htmlFor="toggle-all-push">Push {allPush ? 'All' : anyPush ? 'Some' : 'None'}</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch 
                            id="toggle-all-sms" 
                            checked={allSms} 
                            onCheckedChange={(checked) => handleToggleAll('sms', checked)}
                          />
                          <Label htmlFor="toggle-all-sms">SMS {allSms ? 'All' : anySms ? 'Some' : 'None'}</Label>
                        </div>
                      </div>
                    </>
                  )}
                  {selectedTab === 'email' && (
                    <div className="flex items-center gap-2">
                      <Switch 
                        id="toggle-all-email-tab" 
                        checked={allEmail} 
                        onCheckedChange={(checked) => handleToggleAll('email', checked)}
                      />
                      <Label htmlFor="toggle-all-email-tab">
                        {allEmail ? 'Turn off all email notifications' : 'Turn on all email notifications'}
                      </Label>
                    </div>
                  )}
                  {selectedTab === 'push' && (
                    <div className="flex items-center gap-2">
                      <Switch 
                        id="toggle-all-push-tab" 
                        checked={allPush} 
                        onCheckedChange={(checked) => handleToggleAll('push', checked)}
                      />
                      <Label htmlFor="toggle-all-push-tab">
                        {allPush ? 'Turn off all push notifications' : 'Turn on all push notifications'}
                      </Label>
                    </div>
                  )}
                  {selectedTab === 'sms' && (
                    <div className="flex items-center gap-2">
                      <Switch 
                        id="toggle-all-sms-tab" 
                        checked={allSms} 
                        onCheckedChange={(checked) => handleToggleAll('sms', checked)}
                      />
                      <Label htmlFor="toggle-all-sms-tab">
                        {allSms ? 'Turn off all SMS notifications' : 'Turn on all SMS notifications'}
                      </Label>
                    </div>
                  )}
                </div>

                {/* Individual notification preferences */}
                <TabsContent value="all" className="mt-0 space-y-6">
                  {preferences.map((pref, index) => (
                    <div key={pref.type} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b last:border-0">
                      <div className="mb-4 sm:mb-0">
                        <h3 className="font-medium">{pref.title}</h3>
                        <p className="text-sm text-muted-foreground">{pref.description}</p>
                      </div>
                      <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                          <Switch 
                            id={`${pref.type}-email`} 
                            checked={pref.email} 
                            onCheckedChange={(checked) => handleToggle(index, 'email', checked)}
                          />
                          <Label htmlFor={`${pref.type}-email`} className="text-sm">Email</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch 
                            id={`${pref.type}-push`} 
                            checked={pref.push} 
                            onCheckedChange={(checked) => handleToggle(index, 'push', checked)}
                          />
                          <Label htmlFor={`${pref.type}-push`} className="text-sm">Push</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch 
                            id={`${pref.type}-sms`} 
                            checked={pref.sms} 
                            onCheckedChange={(checked) => handleToggle(index, 'sms', checked)}
                          />
                          <Label htmlFor={`${pref.type}-sms`} className="text-sm">SMS</Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="email" className="mt-0 space-y-6">
                  {preferences.map((pref, index) => (
                    <div key={pref.type} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b last:border-0">
                      <div>
                        <h3 className="font-medium">{pref.title}</h3>
                        <p className="text-sm text-muted-foreground">{pref.description}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-4 sm:mt-0">
                        <Switch 
                          id={`${pref.type}-email-tab`} 
                          checked={pref.email} 
                          onCheckedChange={(checked) => handleToggle(index, 'email', checked)}
                        />
                        <Label htmlFor={`${pref.type}-email-tab`} className="text-sm">
                          {pref.email ? 'On' : 'Off'}
                        </Label>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="push" className="mt-0 space-y-6">
                  {preferences.map((pref, index) => (
                    <div key={pref.type} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b last:border-0">
                      <div>
                        <h3 className="font-medium">{pref.title}</h3>
                        <p className="text-sm text-muted-foreground">{pref.description}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-4 sm:mt-0">
                        <Switch 
                          id={`${pref.type}-push-tab`} 
                          checked={pref.push} 
                          onCheckedChange={(checked) => handleToggle(index, 'push', checked)}
                        />
                        <Label htmlFor={`${pref.type}-push-tab`} className="text-sm">
                          {pref.push ? 'On' : 'Off'}
                        </Label>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="sms" className="mt-0 space-y-6">
                  {preferences.map((pref, index) => (
                    <div key={pref.type} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b last:border-0">
                      <div>
                        <h3 className="font-medium">{pref.title}</h3>
                        <p className="text-sm text-muted-foreground">{pref.description}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-4 sm:mt-0">
                        <Switch 
                          id={`${pref.type}-sms-tab`} 
                          checked={pref.sms} 
                          onCheckedChange={(checked) => handleToggle(index, 'sms', checked)}
                        />
                        <Label htmlFor={`${pref.type}-sms-tab`} className="text-sm">
                          {pref.sms ? 'On' : 'Off'}
                        </Label>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <div className="flex justify-end mt-8">
                  {showSuccess && (
                    <div className="flex items-center gap-2 text-green-600 mr-4">
                      <Check className="h-4 w-4" />
                      <span>Preferences saved!</span>
                    </div>
                  )}
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Preferences"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </Tabs>

        <Card className="bg-gray-50 mt-8">
          <CardHeader>
            <CardTitle className="text-lg">About Notifications</CardTitle>
            <CardDescription>
              How notifications work on Akawo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Email Notifications</h3>
              <p className="text-sm text-muted-foreground">Sent to the email address associated with your account. You can unsubscribe from any email by clicking the unsubscribe link at the bottom of the message.</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Push Notifications</h3>
              <p className="text-sm text-muted-foreground">Delivered to your device when you have the Akawo app installed. You can also control push notifications in your device settings.</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">SMS Notifications</h3>
              <p className="text-sm text-muted-foreground">Text messages sent to your verified phone number. Standard messaging rates may apply depending on your mobile carrier.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsPage;