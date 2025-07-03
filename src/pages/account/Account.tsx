import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Package, CreditCard, MapPin, Bell, Heart } from 'lucide-react';

const AccountPage: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Please sign in</h1>
          <p className="text-muted-foreground mb-6">You need to be logged in to view your account</p>
          <Button asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  const accountLinks = [
    { 
      title: 'My Profile', 
      description: 'View and update your personal information',
      icon: <User className="h-8 w-8" />,
      path: '/account/profile'
    },
    { 
      title: 'My Orders', 
      description: 'Track and manage your orders',
      icon: <Package className="h-8 w-8" />,
      path: '/orders'
    },
    { 
      title: 'Payment Methods', 
      description: 'Manage your payment options',
      icon: <CreditCard className="h-8 w-8" />,
      path: '/account/payment-methods'
    },
    { 
      title: 'Addresses', 
      description: 'Manage your shipping and billing addresses',
      icon: <MapPin className="h-8 w-8" />,
      path: '/account/addresses'
    },
    { 
      title: 'Notifications', 
      description: 'Configure your notification preferences',
      icon: <Bell className="h-8 w-8" />,
      path: '/account/notifications'
    },
    { 
      title: 'Favorites', 
      description: 'View your saved products and sellers',
      icon: <Heart className="h-8 w-8" />,
      path: '/favorites'
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Account</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user.firstName} {user.lastName}
            </p>
          </div>
          <Button variant="outline" onClick={logout} className="mt-4 md:mt-0">
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accountLinks.map((link) => (
            <Link to={link.path} key={link.title} className="block no-underline">
              <Card className="h-full transition-all hover:border-primary hover:shadow-md">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    {link.icon}
                  </div>
                  <div>
                    <CardTitle>{link.title}</CardTitle>
                    <CardDescription className="mt-1.5">{link.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;