import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Game } from '~/models/game'

export function exportGameToPDF(game: Game) {
  const doc = new jsPDF({ orientation: 'landscape' })

  /* ================= HEADER ================= */
  doc.setFontSize(16)
  doc.text('Remi Box — Hasil Permainan', 14, 15)

  doc.setFontSize(10)
  doc.text(
    `Tanggal: ${new Date(game.createdAt).toLocaleString('id-ID')}`,
    14,
    22
  )

  /* ================= TABEL SKOR ================= */

  // 🔹 HEADER (BARIS PERTAMA)
  const head = [
    [
      'Pemain',
      ...game.players.map(player => player.name)
    ]
  ]

  // 🔹 BARIS SESI
  const body: (string | number)[][] = []

  game.sessions.forEach(session => {
    const row: (string | number)[] = [
      `Sesi ${session.index}`
    ]

    game.players.forEach(player => {
      const score =
        session.scores.find(s => s.playerId === player.id)?.score ?? ''

      row.push(score)
    })

    body.push(row)
  })

  // 🔹 BARIS TOTAL (TERAKHIR)
  const totalRow: (string | number)[] = ['Total']

  game.players.forEach(player => {
    const total = game.sessions.reduce((sum, session) => {
      const score =
        session.scores.find(s => s.playerId === player.id)?.score ?? 0
      return sum + score
    }, 0)

    totalRow.push(total)
  })

  body.push(totalRow)

  autoTable(doc, {
    startY: 30,
    head,
    body,
    styles: {
      halign: 'center',
      fontSize: 10
    },
    headStyles: {
      fillColor: [31, 41, 55], // gray-800
      textColor: 255
    },
    didParseCell(data) {
      // Bold baris Total
      if (data.row.index === body.length - 1) {
        data.cell.styles.fontStyle = 'bold'
      }
    }
  })

  /* ================= HALAMAN RANKING ================= */
  doc.addPage()

  doc.setFontSize(14)
  doc.text('Ranking Akhir', 14, 15)

  const ranking = [...game.players]
    .map(player => {
      const total = game.sessions.reduce((sum, session) => {
        const s = session.scores.find(sc => sc.playerId === player.id)
        return sum + (s?.score ?? 0)
      }, 0)

      const lastScore =
        game.sessions.at(-1)?.scores.find(
          s => s.playerId === player.id
        )?.score ?? 0

      return { name: player.name, total, lastScore }
    })
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total
      return b.lastScore - a.lastScore
    })

  autoTable(doc, {
    startY: 22,
    head: [['Peringkat', 'Pemain', 'Total', 'Sesi Terakhir']],
    body: ranking.map((r, i) => [
      i + 1,
      r.name,
      r.total,
      r.lastScore
    ]),
    styles: {
      halign: 'center'
    },
    headStyles: {
      fillColor: [31, 41, 55],
      textColor: 255
    }
  })

  doc.save('remi-box-score.pdf')
}