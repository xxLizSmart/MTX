import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
const DownloadPage = () => {
  return <>
      <Helmet>
        <title>Download MetaTradeX App</title>
        <meta name="description" content="Download the MetaTradeX mobile app for Android. Trade anytime, anywhere with our powerful and secure trading platform." />
      </Helmet>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Trade on the Go</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Experience the full power of MetaTradeX in the palm of your hand. Our mobile app provides a seamless and secure trading experience, wherever you are.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{
          opacity: 0,
          x: -50
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }}>
            <Card className="glassmorphic glowing-border overflow-hidden">
              <CardHeader>
                <CardTitle className="text-3xl">Get the App</CardTitle>
                <CardDescription>Scan the QR code or click the button below to download the app for your Android device.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-8">
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <img width="200" height="200" alt="QR code to download the MetaTradeX Android app" src="https://horizons-cdn.hostinger.com/911b6dd9-a6dc-482b-b727-f1a7cb5e689b/untitled-design-40-5E07U.png" />
                </div>
                <a href="https://drive.usercontent.google.com/download?id=1b1eacuNkYy8tJWovk-PwfarO-DZr94S0&export=download&authuser=0&confirm=t&uuid=7007fec2-f1aa-4d70-b00a-ec24aec3a580&at=AKSUxGPDCsE5VxElpppOMekGme1u:1760543231362" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="w-full">
                    <Download className="mr-2 h-5 w-5" />
                    Download for Android
                  </Button>
                </a>
                <div className="w-full">
                  <div className="flex items-center justify-center p-3 bg-blue-500/10 text-blue-400 rounded-lg">
                    <img src="https://horizons-cdn.hostinger.com/911b6dd9-a6dc-482b-b727-f1a7cb5e689b/1754455-6AT3j.png" alt="Apple Logo" className="h-6 w-6 mr-3" />
                    <p className="font-semibold">IOS App: Coming Soon!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div initial={{
          opacity: 0,
          scale: 0.8
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }} className="relative h-[600px] flex items-center justify-center">
              <img className="absolute max-w-xs md:max-w-sm h-auto z-10" alt="Mobile phone mockup showing the MetaTradeX app interface" src="https://horizons-cdn.hostinger.com/911b6dd9-a6dc-482b-b727-f1a7cb5e689b/untitled-design-39-PJMii.png" />
              <div className="absolute w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-48 h-48 bg-secondary/20 rounded-full blur-3xl"></div>
          </motion.div>
        </div>

        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.8,
        duration: 0.5
      }} className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">App Features</h2>
            <p className="text-muted-foreground mt-2">Everything you need for a professional trading experience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                  <Smartphone className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Full Trading Functionality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Access all markets, order types, and advanced charting tools directly from your phone.</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Secure Wallet Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Deposit, withdraw, and manage your assets with our multi-layered security system.</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Real-Time Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Set custom price alerts and get instant notifications so you never miss a market move.</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </>;
};
export default DownloadPage;