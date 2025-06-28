import QRCode from 'qrcode';

export const generateQRCode = async (data) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: 200,
      margin: 2,
      color: {
        dark: '#2563eb',
        light: '#ffffff'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Erreur lors de la génération du QR code:', error);
    throw new Error('Impossible de générer le QR code');
  }
};

export const generateRemiseQRCode = (remiseId, agent, date) => {
  const qrData = {
    id: remiseId,
    agent,
    date,
    type: 'remise_materiel',
    url: `${window.location.origin}/remises/${remiseId}`
  };
  
  return generateQRCode(JSON.stringify(qrData));
};