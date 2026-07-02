type PixPayloadInput = {
  pixKey: string
  merchantName: string
  merchantCity: string
  amount: number
  txid?: string
}

function onlyAscii(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9 $%*+\-./:]/g, '')
    .trim()
}

function emv(id: string, value: string) {
  return `${id}${String(value.length).padStart(2, '0')}${value}`
}

function crc16(payload: string) {
  let crc = 0xffff

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8

    for (let bit = 0; bit < 8; bit++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021
      } else {
        crc <<= 1
      }
      crc &= 0xffff
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0')
}

export function gerarPixCopiaECola({
  pixKey,
  merchantName,
  merchantCity,
  amount,
  txid = 'PRESENTE',
}: PixPayloadInput) {
  if (!pixKey) throw new Error('Chave Pix não configurada.')
  if (!amount || amount <= 0) throw new Error('Valor da cota inválido.')

  const name = onlyAscii(merchantName).slice(0, 25) || 'CASAL'
  const city = onlyAscii(merchantCity).slice(0, 15) || 'BRASIL'
  const safeTxid = onlyAscii(txid).replace(/\s/g, '').slice(0, 25) || 'PRESENTE'

  const merchantAccountInfo = emv('00', 'br.gov.bcb.pix') + emv('01', pixKey.trim())

  const payloadSemCrc =
    emv('00', '01') +
    emv('26', merchantAccountInfo) +
    emv('52', '0000') +
    emv('53', '986') +
    emv('54', amount.toFixed(2)) +
    emv('58', 'BR') +
    emv('59', name) +
    emv('60', city) +
    emv('62', emv('05', safeTxid)) +
    '6304'

  return payloadSemCrc + crc16(payloadSemCrc)
}
