import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Autoplay from "embla-carousel-autoplay"
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Loader2, Edit } from 'lucide-react';

const promoBanners = [
  {
    id: 1,
    imageUrl: 'https://horizons-cdn.hostinger.com/911b6dd9-a6dc-482b-b727-f1a7cb5e689b/2b2f61d702d0e5c4532fcb7bf4935412.png',
    title: 'MetaTradeX Cashback Bonus',
    description: '10% Cashback on Every $20,000 Traded. MetaTradeX offers a 10% cashback reward to users on their trading volume. For every cumulative $20,000 in trades you execute on the platform, you will receive a cashback bonus. This bonus is calculated as 10% of that $20,000, which equals a $2,000 reward. This is an incentive for active traders, providing them with a direct return on their trading activity.'
  },
  {
    id: 2,
    imageUrl: 'https://horizons-cdn.hostinger.com/911b6dd9-a6dc-482b-b727-f1a7cb5e689b/1088d86d7f1ffe06bafbf7efd1f6a051.png',
    title: 'MetaTradeX KYC Bonus: Get $15 FREE with Primary Verification!',
    description: 'This is a welcome bonus promotion designed to encourage new users to complete the initial identity verification process. When you successfully complete the "Primary Verification" steps on the platform, you will be rewarded with a $15 bonus that is credited directly to your account. This is a one-time reward for each user and is an easy way to get some free funds just for completing a necessary security step.'
  }
];

const Assets = () => {
    const { t } = useLanguage();
    const { formatCurrency, currency, exchangeRates } = useCurrency();
    const navigate = useNavigate();
    const { userProfile } = useAuth();
    const { toast } = useToast();
    const [cryptos, setCryptos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [editingAsset, setEditingAsset] = useState(null);
    const [newPrice, setNewPrice] = useState('');
    const [selectedPromo, setSelectedPromo] = useState(null);

    const plugin = useRef(
      Autoplay({ delay: 3000, stopOnInteraction: true })
    )

    const fetchAssets = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('mock_assets').select('*').order('id');
            if (error) throw error;
            setCryptos(data);
        } catch (error) {
            console.error("Error fetching assets:", error);
            toast({ variant: 'destructive', title: 'Failed to fetch assets', description: error.message });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchAssets();
    }, [fetchAssets]);

    const handleEditClick = (asset) => {
        setEditingAsset(asset);
        setNewPrice(asset.price);
    };

    const handleUpdatePrice = async () => {
        if (!editingAsset || !newPrice || parseFloat(newPrice) < 0) {
            toast({ variant: 'destructive', title: 'Invalid Price', description: 'Please enter a valid price.' });
            return;
        }
        setLoading(true);
        const { error } = await supabase
            .from('mock_assets')
            .update({ price: parseFloat(newPrice) })
            .eq('id', editingAsset.id);

        if (error) {
            toast({ variant: 'destructive', title: 'Update Failed', description: error.message });
        } else {
            toast({ title: 'Success!', description: `${editingAsset.name} price updated.` });
            setEditingAsset(null);
            setNewPrice('');
            await fetchAssets();
        }
        setLoading(false);
    };

    const filteredCryptos = cryptos.filter(crypto =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getConvertedPrice = (price) => {
        const rate = exchangeRates[currency.toLowerCase()] || 1;
        return price * rate;
    };

    return (
        <>
            <Helmet>
                <title>{t('assets')} - MetaTradeX</title>
            </Helmet>
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">

                <div className="mb-8">
                  <Carousel
                    plugins={[plugin.current]}
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    className="w-full"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                  >
                    <CarouselContent>
                      {promoBanners.map((promo) => (
                        <CarouselItem key={promo.id} onClick={() => setSelectedPromo(promo)} className="cursor-pointer flex justify-center items-center">
                            <div className="flex items-center justify-center" style={{ width: '844.4px', height: '403.6px' }}>
                              <img src={promo.imageUrl} alt={promo.title} className="w-full h-full object-contain" />
                            </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden sm:flex" />
                    <CarouselNext className="hidden sm:flex" />
                  </Carousel>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold">{t('topCryptos')}</h1>
                    <div className="w-full sm:w-auto sm:max-w-xs">
                        <Input 
                            type="text"
                            placeholder="Search assets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading && !editingAsset ? (
                    <div className="text-center h-64 flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin"/></div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredCryptos.map(crypto => (
                            <Card key={crypto.id} className="hover:shadow-lg transition-shadow glassmorphic relative">
                                {userProfile?.is_admin && (
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="absolute top-2 right-2 h-8 w-8"
                                        onClick={() => handleEditClick(crypto)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                )}
                                <CardContent className="p-4 flex flex-col justify-between h-full">
                                    <div className="flex items-center mb-4">
                                        <img src={crypto.icon_url} alt={crypto.name} className="h-10 w-10 mr-4" />
                                        <div>
                                            <p className="font-bold text-lg">{crypto.name}</p>
                                            <p className="text-sm text-muted-foreground">{crypto.symbol.toUpperCase()}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-lg">{formatCurrency(getConvertedPrice(crypto.price))}</p>
                                        <p className={`text-sm ${crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {crypto.price_change_percentage_24h ? crypto.price_change_percentage_24h.toFixed(2) : '0.00'}%
                                        </p>
                                    </div>
                                    <Button className="w-full mt-4" onClick={() => navigate(`/trading/${crypto.symbol.toLowerCase()}`)}>
                                        {t('trading')}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <Dialog open={!!editingAsset} onOpenChange={() => setEditingAsset(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Price for {editingAsset?.name}</DialogTitle>
                        <DialogDescription>Update the price for {editingAsset?.symbol.toUpperCase()}.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="price">New Price (USD)</Label>
                        <Input 
                            id="price" 
                            type="number" 
                            value={newPrice} 
                            onChange={(e) => setNewPrice(e.target.value)}
                            placeholder="Enter new price"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingAsset(null)}>Cancel</Button>
                        <Button onClick={handleUpdatePrice} disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Price'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!selectedPromo} onOpenChange={() => setSelectedPromo(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{selectedPromo?.title}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <img src={selectedPromo?.imageUrl} alt={selectedPromo?.title} className="w-full h-auto rounded-lg object-contain" />
                        <DialogDescription>{selectedPromo?.description}</DialogDescription>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setSelectedPromo(null)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Assets;