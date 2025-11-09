export default function IdCardExactBack({
  qrUrlBack = '',
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
    'REGISTERED BY NCT, NEW DELHI, GOVT OF INDIA',
    'REGISTERED NO: 4396/2022 (UNDER TRUST ACT 1882)',
    'TO PROTECT & PROMOTE THE HUMAN RIGHTS'
  ]
  const defaultTerms = termsLines && termsLines.length ? termsLines : [
    'This card is property of HRCI.',
    'Must be presented on demand by authorities.',
    'Non-transferable and revocable.',
    'If found, kindly return to HRCI.'
  ]

  return (
    <div>
      <style jsx global>{`
        @page { size: 85.6mm 54mm; margin: 0; }
        html, body { margin: 0; padding: 0; background: #f3f4f6; }
        :root { --card-w: 85.6mm; --card-h: 54mm; --red: #FE0002; --blue: #17007A; --text: #111827; --muted-bg: #F3F4F6; --top-band: 6.1mm; --bottom-band: 4.6mm; }
        .page { width: var(--card-w); height: var(--card-h); overflow: hidden; page-break-after: always; background: var(--muted-bg); border: 0.2mm solid #e5e7eb; box-sizing: border-box; position: relative; }
        .page:last-child { page-break-after: auto; }
        .band-red { height: var(--top-band); background: var(--red); color: #fff; display: flex; align-items: center; justify-content: center; padding: 0 2mm; box-sizing: border-box; }
        .band-red h1 { margin: 0; font: 900 5.4mm/1 Verdana, Arial, sans-serif; letter-spacing: 0.2mm; text-align: center; text-transform: uppercase; white-space: nowrap; overflow: hidden; }
        .back .body { position: absolute; top: var(--top-band); left: 0; right: 0; height: calc(var(--card-h) - var(--top-band)); box-sizing: border-box; padding: 1.2mm 2mm var(--bottom-band) 2mm; }
        .back .row-main { display: grid; grid-template-columns: 16mm auto 16mm; grid-gap: 1.2mm; align-items: start; margin-top: 2mm; }
        .back .qr { width: 13mm; height: 13mm; object-fit: contain; }
        .back .logo { width: 13mm; height: 13mm; object-fit: cover; display: block; margin-left: auto; }
        .back .reg { text-align: center; color: var(--text); }
        .back .reg .line { margin: 0.4mm 0; font: 800 2.2mm/2.8mm Verdana, Arial, sans-serif; }
        .back .terms-title { margin: 1mm 0 0.6mm 0; font: 900 2.2mm/2.8mm Verdana, Arial, sans-serif; text-align: center; }
        .back .term { margin: 0.3mm 0; font: 700 1.8mm/2.4mm Verdana, Arial, sans-serif; text-align: center; }
        .back .addr-label { margin: 0.6mm 0 0.2mm 0; font: 900 2mm/2.6mm Verdana, Arial, sans-serif; text-align: center; }
        .back .addr { margin: 0 0 0.4mm 0; font: 700 1.8mm/2.4mm Verdana, Arial, sans-serif; text-align: center; }
        .back .web { margin: 0.6mm 0 0 0; font: 800 2mm/2.6mm Verdana, Arial, sans-serif; text-align: center; }
        .back .footer-blue { position: absolute; left: 0; right: 0; bottom: 0; height: var(--bottom-band); background: var(--blue); color: #fff; display: flex; align-items: center; justify-content: center; padding: 0 2mm; box-sizing: border-box; }
        .back .footer-blue p { margin: 0; font: 800 2mm/1 Verdana, Arial, sans-serif; text-align: center; }
      `}</style>

      <section className="page back">
        <div className="band-red">
          <h1>HUMAN RIGHTS COUNCIL FOR INDIA (HRCI)</h1>
        </div>

        <div className="body">
          <div className="row-main">
            <div>{qrUrlBack ? <img className="qr" src={qrUrlBack} alt="QR" /> : null}</div>
            <div className="reg">
              {defaultRegistration.map((line, i) => (<p key={i} className="line">{line}</p>))}

              <p className="terms-title">Terms &amp; Conditions</p>
              {defaultTerms.map((line, i) => (<p key={`t-${i}`} className="term">{line}</p>))}

              {headOfficeAddress ? (<>
                <p className="addr-label">HEAD OFFICE</p>
                <p className="addr">{headOfficeAddress}</p>
              </>) : null}
              {regionalOfficeAddress ? (<>
                <p className="addr-label">REGIONAL OFFICE</p>
                <p className="addr">{regionalOfficeAddress}</p>
              </>) : null}
              {administrationOfficeAddress ? (<>
                <p className="addr-label">ADMINISTRATION OFFICE</p>
                <p className="addr">{administrationOfficeAddress}</p>
              </>) : null}

              {website ? <p className="web">{website}</p> : null}
            </div>
            <div>{secondLogoUrl ? <img className="logo" src={secondLogoUrl} alt="Logo" /> : null}</div>
          </div>
        </div>

        <div className="footer-blue">
          <p>HELP LINE NUMBER {contactNumber1}{contactNumber2 ? `  |  ${contactNumber2}` : ''}</p>
        </div>
      </section>
    </div>
  )
}
