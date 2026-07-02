import { supabase } from '../../lib/supabase'
import { PRESENTES_FIXOS } from '../../lib/presentes-static'
import { PresentesClient } from './PresentesClient'

export const dynamic = 'force-dynamic'

type PresenteRow = {
  id: number
  nome: string | null
  cotas: number | null
  quantidade: number | null
  finalizado: string | null
  valorCota: number | null,
  quantidadeInicial: number | null
}

export default async function PresentesPage() {
  const { data, error } = await supabase
    .from('presentes')
    .select('id,nome,cotas,quantidade,finalizado')
    .order('id', { ascending: true })

  const rows = (data ?? []) as PresenteRow[]
  const rowsById = new Map(rows.map((item) => [item.id, item]))

  const presentes = PRESENTES_FIXOS.map((item) => {
    const banco = rowsById.get(item.id)

    return {
      id: item.id,
      nome: banco?.nome || item.nome,
      imagem: item.imagem,
      totalCotas: item.totalCotas,
      valorCota: Number(banco?.cotas ?? item.valorCota),
      cotasPagas: Number(banco?.quantidade ?? item.quantidadeInicial ?? 0),
      finalizado: banco?.finalizado ?? null,
    }
  })

  return <PresentesClient presentes={presentes} erroSupabase={error?.message} />
}
