

export function formDate(date: string){
  return new Date(date).toLocaleDateString('fr-FR', {
  day: 'numeric',
  month: 'numeric',
  year: '2-digit'
})
}
