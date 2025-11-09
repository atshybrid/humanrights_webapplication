export default function IdCardExactFront({
  logoUrl = '/images/logo.svg',
  qrUrlFront = '',
  cellName = '',
  memberName = '',
  designation = '',
  zone = '',
  idNumber = '',
  contactNumber = '',
  validUpto = '',
  issueDate = '',
  photoUrl = '',
  stampUrl = '',
  authorSignUrl = '',
}){
  return (
    <div>
      <style jsx global>{`
        @page { size: 85.6mm 54mm; margin: 0; }
        html, body { margin: 0; padding: 0; background: #f3f4f6; }
        :root { --card-w: 85.6mm; --card-h: 54mm; --red: #FE0002; --blue: #17007A; --text: #111827; --muted-bg: #F3F4F6; --top-band: 6.1mm; --blue-band: 6.1mm; --bottom-band: 4.6mm; --body-h: calc(var(--card-h) - var(--top-band) - var(--blue-band) - var(--bottom-band)); }
        .page { width: var(--card-w); height: var(--card-h); overflow: hidden; page-break-after: always; background: var(--muted-bg); border: 0.2mm solid #e5e7eb; box-sizing: border-box; position: relative; }
        .page:last-child { page-break-after: auto; }
        .band-red { height: var(--top-band); background: var(--red); color: #fff; display: flex; align-items: center; justify-content: center; padding: 0 2mm; box-sizing: border-box; }
        .band-red h1 { margin: 0; font: 900 5.4mm/1 Verdana, Arial, sans-serif; letter-spacing: 0.2mm; text-align: center; text-transform: uppercase; white-space: nowrap; overflow: hidden; }
        .band-blue { height: var(--blue-band); background: var(--blue); color: #fff; display: flex; align-items: center; justify-content: center; padding: 0 2mm; box-sizing: border-box; }
        .band-blue p { margin: 0; font: 700 2.2mm/3.0mm Verdana, Arial, sans-serif; letter-spacing: 0.1mm; text-align: center; }
        .footer-red { position: absolute; left: 0; right: 0; bottom: 0; height: var(--bottom-band); background: var(--red); color: #fff; display: flex; align-items: center; justify-content: center; padding: 0 2mm; box-sizing: border-box; }
        .footer-red p { margin: 0; font: 800 2mm/1 Verdana, Arial, sans-serif; text-align: center; letter-spacing: 0.05mm; }
        .front .body { position: absolute; top: calc(var(--top-band) + var(--blue-band)); left: 0; right: 0; height: var(--body-h); padding: 1.2mm 2mm 0 2mm; box-sizing: border-box; }
        .front .juris-wrap { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; margin-top: 0.8mm; }
        .front .juris { margin: 0.3mm 0 0 0; font: 900 3.2mm/3.8mm Verdana, Arial, sans-serif; color: #000; letter-spacing: 0.1mm; }
        .front .niti1 { margin: 0.2mm 0 0 0; font: 800 2.2mm/2.8mm Verdana, Arial, sans-serif; color: #000; }
        .front .niti2 { margin: 0.1mm 0 0 0; font: 700 2mm/2.5mm Verdana, Arial, sans-serif; color: #000; }
        .front .works { margin: 0.2mm 0 0 0; font: 800 1.9mm/2.6mm Verdana, Arial, sans-serif; color: var(--red); }
        .front .identity { margin: 0.2mm 0 0 0; font: 900 2.4mm/3.0mm Verdana, Arial, sans-serif; color: var(--red); }
        .front .main { display: grid; grid-template-columns: 18mm auto 26mm; grid-gap: 1.2mm; align-items: start; margin-top: 1.4mm; }
        .front .logo { width: 13.5mm; height: 13.5mm; object-fit: cover; border: 0.4mm solid #fff; background: #fff; display: block; margin-bottom: 1.2mm; }
        .front .qr { width: 14mm; height: 14mm; object-fit: contain; display: block; }
        .front .details { background: #F3F4F6; border: 0.2mm solid #e5e7eb; border-radius: 1.8mm; padding: 2mm 2.2mm; }
        .front .cell { margin: 0 0 0.8mm 0; font: 800 2.4mm/3.0mm Verdana, Arial, sans-serif; color: var(--blue); }
        .front .name { margin: 0 0 0.8mm 0; font: 800 3.0mm/3.6mm Verdana, Arial, sans-serif; color: var(--text); }
        .front .desig { margin: 0 0 1.2mm 0; font: 700 2.4mm/3.0mm Verdana, Arial, sans-serif; color: var(--red); }
        .front .row { display: grid; grid-template-columns: 15mm 2mm auto; align-items: center; column-gap: 1mm; margin: 0.6mm 0; }
        .front .lbl { font: 900 2.2mm/3.0mm Verdana, Arial, sans-serif; color: var(--text); }
        .front .val { font: 800 2.2mm/3.0mm Verdana, Arial, sans-serif; color: var(--text); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
        .front .photo-wrap { position: relative; width: 24mm; height: 28mm; border: 0.2mm solid #e5e7eb; background: #fff; display: flex; align-items: center; justify-content: center; }
        .front .photo { width: calc(100% - 1mm); height: calc(100% - 1mm); object-fit: cover; }
        .front .stamp { position: absolute; right: -3mm; bottom: -3mm; width: 14mm; height: 14mm; border-radius: 50%; object-fit: cover; background: transparent; }
        .front .sign-wrap { margin-top: 1mm; display: flex; flex-direction: column; align-items: center; }
        .front .sign { width: 22mm; height: 10mm; object-fit: contain; background: transparent; }
        .front .sign-label { margin-top: -1.2mm; font: 900 2mm/1 Verdana, Arial, sans-serif; color: var(--blue); }
      `}</style>

      <section className="page front">
        <div className="band-red">
          <h1>HUMAN RIGHTS COUNCIL FOR INDIA (HRCI)</h1>
        </div>
        <div className="band-blue">
          <p>
            REGISTERED BY NCT, NEW DELHI, GOVT OF INDIA<br />
            REGISTERED NO: 4396/2022 (UNDER TRUST ACT 1882)<br />
            TO PROTECT & PROMOTE THE HUMAN RIGHTS
          </p>
        </div>

        <div className="body">
          <div className="juris-wrap">
            <p className="juris">ALL INDIA JURISDICTION</p>
            <p className="niti1">REGD BY GOVT OF "NITI AAYOG"</p>
            <p className="niti2">UNIQUE ID: AP/2022/0324217, AP/2022/0326782</p>
            <p className="works">WORKS AGAINST CRIME, VIOLENCE AND CORRUPTION</p>
            <p className="identity">IDENTITY CARD</p>
          </div>

          <div className="main">
            <div>
              {logoUrl ? <img className="logo" src={logoUrl} alt="Logo" /> : null}
              {qrUrlFront ? <img className="qr" src={qrUrlFront} alt="QR" /> : null}
            </div>

            <div className="details">
              {cellName ? <p className="cell">{cellName}</p> : null}
              {memberName ? <p className="name">{memberName}</p> : null}
              {designation ? <p className="desig">{designation}</p> : null}

              <div className="row"><span className="lbl">Name</span><span>:</span><span className="val">{memberName}</span></div>
              <div className="row"><span className="lbl">Designation</span><span>:</span><span className="val">{designation}</span></div>
              {zone ? <div className="row"><span className="lbl">Zone</span><span>:</span><span className="val">{zone}</span></div> : null}
              {cellName ? <div className="row"><span className="lbl">Cell</span><span>:</span><span className="val">{cellName}</span></div> : null}
              <div className="row"><span className="lbl">ID No</span><span>:</span><span className="val">{idNumber}</span></div>
              <div className="row"><span className="lbl">Contact No</span><span>:</span><span className="val">{contactNumber}</span></div>
              <div className="row"><span className="lbl">Valid Upto</span><span>:</span><span className="val">{validUpto}</span></div>
              {issueDate ? <div className="row"><span className="lbl">Issue Date</span><span>:</span><span className="val">{issueDate}</span></div> : null}
            </div>

            <div>
              <div className="photo-wrap">
                {photoUrl ? <img className="photo" src={photoUrl} alt="Photo" /> : null}
                {stampUrl ? <img className="stamp" src={stampUrl} alt="Stamp" /> : null}
              </div>
              <div className="sign-wrap">
                {authorSignUrl ? <img className="sign" src={authorSignUrl} alt="Author Sign" /> : null}
                <div className="sign-label">Signature Issue Auth.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-red">
          <p>We take help 24x7 From (Police, CBI, Vigilance, NIA) & other Govt. Dept. against crime & corruption.</p>
        </div>
      </section>
    </div>
  )
}
