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
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    const { error: compErr } = await supabase.from('companies').insert({
      user_id: data.user.id,
      cnpj,
      razao_social: razaoSocial,
      email,
      phone,
      city,
      state,
    })
    if (compErr) throw compErr
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
