import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const KYC = () => {
    const { t } = useLanguage();
    const { toast } = useToast();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        country: '',
        phoneNumber: '',
        address: ''
    });
    const [idFile, setIdFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setIdFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let idDocumentUrl = '';
            if (idFile) {
                const fileExt = idFile.name.split('.').pop();
                const fileName = `${user.id}-${Math.random()}.${fileExt}`;
                const filePath = `kyc-documents/${fileName}`;
                
                let storage = supabase.storage.from('documents');

                const { error: uploadError } = await storage.upload(filePath, idFile);

                if (uploadError) {
                    throw new Error(`Upload failed: ${uploadError.message}`);
                }
                
                const { data: urlData } = storage.getPublicUrl(filePath);
                idDocumentUrl = urlData.publicUrl;
            }

            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    first_name: formData.firstName,
                    middle_name: formData.middleName,
                    last_name: formData.lastName,
                    country: formData.country,
                    phone: formData.phoneNumber,
                    address: formData.address,
                    id_document_url: idDocumentUrl,
                    kyc_status: 'pending'
                })
                .eq('id', user.id);

            if (updateError) {
                throw updateError;
            }

            toast({ title: 'Success!', description: 'Your KYC information has been submitted for review.' });
            
            setFormData({
                firstName: '',
                middleName: '',
                lastName: '',
                country: '',
                phoneNumber: '',
                address: ''
            });
            setIdFile(null);

        } catch (error) {
            console.error('KYC Submission Error:', error);
            toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to submit KYC' });
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <>
            <Helmet><title>{t('kyc')} - MetaTradeX</title></Helmet>
            <div className="container mx-auto px-6 py-4 sm:p-6 lg:p-8 flex justify-center">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">KYC Verification</CardTitle>
                        <CardDescription>Please fill in your details accurately for verification.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label htmlFor="firstName">First Name</Label><Input id="firstName" value={formData.firstName} onChange={handleChange} required/></div>
                                <div className="space-y-2"><Label htmlFor="lastName">Last Name</Label><Input id="lastName" value={formData.lastName} onChange={handleChange} required/></div>
                            </div>
                            <div className="space-y-2"><Label htmlFor="middleName">Middle Name (Optional)</Label><Input id="middleName" value={formData.middleName} onChange={handleChange} /></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label htmlFor="country">Country</Label><Input id="country" value={formData.country} onChange={handleChange} required/></div>
                                <div className="space-y-2"><Label htmlFor="phoneNumber">Phone Number</Label><Input id="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} required/></div>
                            </div>
                            <div className="space-y-2"><Label htmlFor="address">Full Address</Label><Input id="address" value={formData.address} onChange={handleChange} required/></div>

                            <div>
                                <Label htmlFor="id-file">Upload ID Document</Label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <div className="flex text-sm text-muted-foreground">
                                            <Label htmlFor="id-file-upload" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80"><input id="id-file-upload" type="file" className="sr-only" onChange={handleFileChange} required /><span>Upload a file</span></Label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        {idFile ? <p className="text-xs">{idFile.name}</p> : <p className="text-xs">Passport, Driver's License, etc.</p>}
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="w-full !mt-8" size="lg" disabled={loading}>{loading ? 'Submitting...' : 'Submit for Verification'}</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default KYC;