import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';

const Privacy = () => {
  const { t } = useLanguage();

  const sections = [
    { title: 'Information We Collect', content: 'We collect information you provide directly to us, such as when you create an account, complete your profile, or contact customer support. This may include your name, email address, phone number, and any other information you choose to provide.' },
    { title: 'How We Use Information', content: 'We use the information we collect to provide, maintain, and improve our services, including to process transactions, prevent fraud, and personalize your experience. We may also use the information to communicate with you about products, services, offers, and events offered by MetaTradeX and others.' },
    { title: 'Information Sharing', content: 'We do not share your personal information with third parties except as described in this Privacy Policy. We may share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.' },
    { title: 'Data Security', content: 'We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. However, no security system is impenetrable, and we cannot guarantee the security of our systems 100%.' },
    { title: 'Your Choices', content: 'You may update, correct, or delete information about you at any time by logging into your account. If you wish to delete or deactivate your account, please email us, but note that we may retain certain information as required by law or for legitimate business purposes.' },
    { title: 'Changes to This Policy', content: 'We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice (such as adding a statement to our homepage or sending you a notification).' }
  ];

  return (
    <>
      <Helmet>
        <title>{t('privacy')} - MetaTradeX</title>
      </Helmet>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold tracking-tight gradient-text">{t('privacy')}</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Your privacy is important to us.
          </p>
          <p className="text-sm text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </motion.div>

        <Card className="max-w-4xl mx-auto glassmorphic">
            <CardContent className="p-8 space-y-6">
                {sections.map((section, index) => (
                    <div key={index}>
                        <h2 className="text-2xl font-semibold mb-2 text-primary">{section.title}</h2>
                        <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                    </div>
                ))}
            </CardContent>
        </Card>

      </div>
    </>
  );
};

export default Privacy;