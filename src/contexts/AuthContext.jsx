import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession]   = useState(undefined) // undefined = carregando
  const [company, setCompany]   = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session?.user) { setCompany(null); return }
    supabase
      .from('companies')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle()
      .then(({ data }) => setCompany(data))
  }, [session])

  const signUp = async ({ email, password, cnpj, razaoSocial, phone, city, state }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { cnpj, razao_social: razaoSocial, phone, city, state },
        emailRedirectTo: `${window.location.origin}/painel`,
      },
    })
    if (error) throw error

    // Fallback: cria empresa diretamente caso o trigger do banco não exista.
    // ignoreDuplicates: true → não falha se o trigger já criou.
    if (data.session && data.user) {
      await supabase.from('companies').upsert({
        user_id:      data.user.id,
        razao_social: razaoSocial,
        cnpj:         cnpj.replace(/\D/g, ''),
        email,
        phone:        phone  || null,
        city:         city   || null,
        state:        state  || null,
        role:         'seller',
        cnpj_verified: false,
      }, { onConflict: 'user_id', ignoreDuplicates: true })
    }

    // Informa se precisa de confirmação de e-mail
    return { emailConfirmationRequired: !data.session }
  }

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signOut = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ session, company, signUp, signIn, signOut, loading: session === undefined }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
