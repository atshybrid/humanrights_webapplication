export default function IdCardExactBack({
  qrUrlBack = '',
  watermarkUrl = '',
  registrationLines = [],
  termsLines = [],
  headOfficeAddress = '',
  regionalOfficeAddress = '',
  administrationOfficeAddress = '',
  website = '',
  secondLogoUrl = '',
  contactNumber1 = '',
  contactNumber2 = '',
}){
  const defaultRegistration = registrationLines && registrationLines.length ? registrationLines : [
    'REGISTERED BY MINISTRY OF CORPORATE AFFAIRS, INDIA',
    'REGD NO: CSR0036936 OF "HRCI", CSR 00038592 OF "HRCI"',
    'REGD NO: BK-IV-46/2022 "HRCI" ISO CERTIFICATE NO: ΙΝΟ/ΑΡ12129/0922',
    'REGD UNDER "UDYAM" NO: AP-21-0001051, AP-21-0001502 "HRCI"',
    'REGD BY: MINISTRY OF SOCIAL JUSTICE AND EMPOWERMENT',
    'GOVT OF INDIA REGD BY AP/00036080'
  ]
  const defaultTerms = termsLines && termsLines.length ? termsLines : [
    'This card is the property of HRCI and must be returned upon request to HRCI management.',
    'This card can be withdrawn any time without notice.',
    'Use this card as per the terms and conditions of the card holder agreement.',
    'If found please return this card to nearest police station or HRCI office.'
  ]

  return (
    <div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&display=swap');
        @page { size: 85.6mm 54mm; margin: 0; }
        html,body{height:100%;margin:0}
        body{background:#f4f4f4;font-family:'Poppins',sans-serif;}
        .card{width:85.6mm;height:54mm;background:#fff;box-shadow:0 0 5px rgba(0,0,0,0.12);position:relative;overflow:hidden;}
        .strip-top{height:6.35mm;background:linear-gradient(to bottom, #FE0002 0%, #FE0002 49.999%, #1D0DA1 50%, #1D0DA1 100%);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;text-transform:uppercase;font-size:9pt;padding:0 4mm;position:absolute;top:0;left:0;right:0;z-index:5;}
        .back-center{position:absolute;top:6.35mm;left:0;right:0;bottom:4.6mm;display:flex;flex-direction:column;justify-content:flex-start;align-items:flex-start;padding:2.5mm;box-sizing:border-box;background:#fff;z-index:4;}
        .watermark{position:absolute;top:55%;left:50%;transform:translate(-50%,-50%);width:30mm;height:30mm;opacity:0.3;pointer-events:none;z-index:3;object-fit:contain;filter: sepia(1) saturate(5) hue-rotate(10deg) brightness(1.05) contrast(1.1);}
        .registration-text,.terms,.office-address{position:relative;z-index:5;}
        .qr-large{position:absolute;top:2.0mm;left:2.0mm;width:12mm;height:12mm;border:1px solid #e0e0e0;display:block;margin:0;z-index:6;}
        .registration-text{font-size:4.2pt;line-height:1.5;color:#000;font-weight:600;text-transform:uppercase;margin-left:14mm;margin-top:0;text-align:left;}
        .terms{margin-left:2mm;margin-top:0.8mm;font-size:4pt;color:#000;}
        .terms strong{color:#FE0002;font-weight:700}
        .terms ol{margin:0;padding-left:2mm;}
        .terms li{margin:0}
        .office-address{margin-top:0.5mm;font-size:4pt;line-height:1;text-align:center;}
        .office-address p{margin:0.2mm 0}
        .office-address strong{display:block;color:#000;font-weight:700;margin-bottom:0.2mm;text-align:center;}
        .hrci-logo-right{position:absolute;top:2mm;right:2mm;width:12mm;height:12mm;opacity:1;z-index:6;object-fit:contain;}
        .strip-bottom{position:absolute;bottom:0;left:0;right:0;background:#FE0002;height:4.6mm;color:#fff;display:flex;align-items:center;justify-content:center;font-size:4.5pt;text-align:center;padding:0 3mm;z-index:6;}
        .help-label{font-weight:700;margin-right:4px}
        #contactNumbers{font-weight:700}
      `}</style>

      <div className="card">
        <div className="strip-top">Human Rights Council for India (HRCI)</div>
        <div className="back-center">
          {watermarkUrl ? <img className="watermark" src={watermarkUrl} alt="watermark"/> : null}
          {qrUrlBack ? <img className="qr-large" src={qrUrlBack} alt="QR"/> : null}
          <div className="registration-text">
            {defaultRegistration.map((line, i) => (<div key={i}>{line}<br/></div>))}
          </div>
          <div className="terms">
            <strong>Terms &amp; Conditions:-</strong>
            <ol>
              {defaultTerms.map((line, i) => (<li key={i}>{line}</li>))}
            </ol>
            <hr style={{border:0,borderTop:'0.3mm solid #000',margin:'0.6mm 0'}}/>
            <div className="office-address">
              {headOfficeAddress ? (<p><strong>Head Office:</strong> <span>{headOfficeAddress}</span></p>) : null}
              {regionalOfficeAddress ? (<p><strong>Regional Office:</strong> <span>{regionalOfficeAddress}</span></p>) : null}
              {administrationOfficeAddress ? (<p><strong>Administration Office:</strong> <span>{administrationOfficeAddress}</span></p>) : null}
              {website ? (<p><strong>Website:</strong> <span>{website}</span></p>) : null}
            </div>
          </div>
          {secondLogoUrl ? <img className="hrci-logo-right" src={secondLogoUrl} alt="HRCI Logo"/> : null}
        </div>
        <div className="strip-bottom"><span className="help-label">Help Line Number:</span> <span id="contactNumbers">{[contactNumber1, contactNumber2].filter(Boolean).join('  |  ') || '-'}</span></div>
      </div>
    </div>
  )
}
