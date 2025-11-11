export default function IdCardExactFront({
  logoUrl = '/images/logo.svg',
  qrUrlFront = '',
  cellName = '',
  memberName = '',
  designation = '',
  workPlace = '',
  idNumber = '',
  contactNumber = '',
  validUpto = '',
  photoUrl = '',
  stampUrl = '',
  authorSignUrl = '',
  watermarkUrl = '',
}){
  return (
    <div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&display=swap');
        @page { size: 85.6mm 54mm; margin: 0; }
        html, body { margin: 0; padding: 0; background: #f4f4f4; }
        .card { width: 85.6mm; height: 54mm; background: #fff; border-radius: 0mm; box-shadow: 0 0 5px rgba(0,0,0,0.2); overflow: hidden; font-family: 'Poppins', sans-serif; position: relative; }
        .strip-top { background: #FE0002; height: 6.35mm; color: #fff; display: flex; justify-content: center; align-items: center; font-weight: 700; text-transform: uppercase; font-size: 9pt; }
        .strip-blue { background: #1D0DA1; height: 6.35mm; color: #fff; display: flex; align-items: center; justify-content: center; text-align: center; font-size: 4.5pt; line-height: 1.05; font-weight: 600; text-transform: uppercase; padding-top: 0.2mm; }
  .center { display: flex; justify-content: space-between; align-items: flex-start; height: 36.7mm; padding: 2mm; position: relative; }
  .watermark{position:absolute;top:55%;left:50%;transform:translate(-50%,-50%);width:30mm;height:30mm;opacity:0.3;pointer-events:none;z-index:1;object-fit:contain;filter: sepia(1) saturate(5) hue-rotate(10deg) brightness(1.05) contrast(1.1);}        
        .left { width: 19mm; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; }
        .left img { width: 13mm; margin-bottom: 2mm; display: block; }
        .middle { flex: 1; padding: 0 1mm; font-size: 4.8pt; line-height: 1.3; box-sizing: border-box; }
        .jurisdiction { font-weight: 700; font-size: 8pt; color: #000; text-align: center; margin-bottom: 0.4mm; width: 100%; display: flex; justify-content: center; align-items: center; }
        .regd, .unique, .work-against, .identity { display: block; text-transform: uppercase; white-space: nowrap; text-align: center; margin-bottom: 0.25mm; }
        .unique { font-size: 5pt; color: #000; font-weight: 600; }
        .work-against { color: #FE0002; font-size: 4pt; font-weight: 700; }
        .identity { color: #FE0002; font-size: 6pt; font-weight: 700; }
        .member-info { margin-top: 1mm; font-size: 4.7pt; text-align: left; line-height: 1.5; width: calc(100% - 20mm); }
        .member-info div { display: grid; grid-template-columns: 14mm 1.5mm auto; align-items: center; }
        .member-info .label { font-weight: 700; text-align: left; }
        .member-info .colon { text-align: center; }
        .member-info .value { text-align: left; white-space: nowrap; overflow: visible; text-overflow: unset; font-weight: 600; text-transform: uppercase; }
        #validUptoValue { color: #FE0002; font-weight: 700; }
        .right { width: 18mm; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; margin-right: 2mm; margin-top: 4mm; position: relative; }
        .member-photo { width: 16.5mm; height: 21mm; border-radius: 3mm; border: 1px solid #ccc; object-fit: cover; }
        .sign-img { position: absolute; width: 11mm; bottom: -10mm; opacity: 0.9; }
        .signature-text { font-weight: 700; font-size: 5pt; color: #000; text-align: center; position: absolute; bottom: -9mm; width: 100%; }
        .stamp { position: absolute; width: 9mm; bottom: -3mm; left: -3mm; opacity: 0.9; }
        .strip-bottom { background: #FE0002; height: 4.6mm; color: #fff; font-size: 4.5pt; text-align: center; display: flex; align-items: center; justify-content: center; white-space: nowrap; position: absolute; bottom: 0; width: 100%; }
      `}</style>

      <div className="card">
        <div className="strip-top">Human Rights Council for India (HRCI)</div>
        <div className="strip-blue">
          REGISTERED BY NCT, NEW DELHI, GOVT OF INDIA<br/>
          REGISTERED NO: 4396/2022 (UNDER TRUST ACT 1882)<br/>
          TO PROTECT & PROMOTE THE HUMAN RIGHTS
        </div>
        <div className="center">
          {/* watermark behind content */}
          {watermarkUrl ? <img className="watermark" src={watermarkUrl} alt="watermark" /> : null}
          <div className="left" style={{zIndex:2}}>
            {logoUrl ? <img src={logoUrl} alt="Logo" /> : null}
            {qrUrlFront ? <img src={qrUrlFront} alt="QR Code" /> : null}
          </div>
          <div className="middle" style={{zIndex:2}}>
            <span className="jurisdiction">ALL INDIA JURISDICTION</span>
            <span className="regd">REGD BY GOVT OF NITI AAYOG</span>
            <span className="unique">UNIQUE ID: AP/2022/0324217, AP/2022/0326782</span>
            <span className="work-against">WORKS AGAINST CRIME, VIOLENCE AND CORRUPTION</span>
            <span className="identity">IDENTITY CARD</span>
            <div className="member-info">
              <div><span className="label">Name</span><span className="colon">:</span><span className="value">{memberName || '-'}</span></div>
              <div><span className="label">Designation</span><span className="colon">:</span><span className="value">{designation || '-'}</span></div>
              <div><span className="label">Cell</span><span className="colon">:</span><span className="value">{cellName || '-'}</span></div>
              <div><span className="label">Work Place</span><span className="colon">:</span><span className="value">{workPlace || '-'}</span></div>
              <div><span className="label">ID No</span><span className="colon">:</span><span className="value">{idNumber || '-'}</span></div>
              <div><span className="label">Contact No</span><span className="colon">:</span><span className="value">{contactNumber || '-'}</span></div>
              <div><span className="label">Valid Upto</span><span className="colon">:</span><span id="validUptoValue" className="value">{validUpto || '-'}</span></div>
            </div>
          </div>
          <div className="right" style={{zIndex:2}}>
            {photoUrl ? <img className="member-photo" src={photoUrl} alt="Member Photo" /> : <div className="member-photo" />}
            {authorSignUrl ? <img className="sign-img" src={authorSignUrl} alt="Authorized Signature" /> : null}
            <div className="signature-text">Signature Auth.</div>
            {stampUrl ? <img className="stamp" src={stampUrl} alt="HRCI Stamp" style={{top:'-3mm', left:'-3mm', bottom:'auto'}} /> : null}
          </div>
        </div>
        <div className="strip-bottom">We take help 24x7 From (Police, CBI, Vigilance, NIA) & other Govt. Dept. Against Crime & Corruption.</div>
      </div>
    </div>
  )
}
