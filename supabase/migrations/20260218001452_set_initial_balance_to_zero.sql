/*
  # Set initial balance to zero for new signups

  1. Changes
    - Update give_initial_balance trigger to give 0 USDT instead of 1000
    - Users must deposit and have it approved to get a balance

  2. Notes
    - Existing users keep their current balances unchanged
*/

DROP TRIGGER IF EXISTS on_profile_created_give_balance ON public.profiles;
DROP FUNCTION IF EXISTS give_initial_balance() CASCADE;

CREATE OR REPLACE FUNCTION public.give_initial_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_assets (user_id, symbol, amount)
  VALUES (NEW.id, 'USDT', 0)
  ON CONFLICT (user_id, symbol)
  DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error in give_initial_balance for %: % - %', NEW.id, SQLSTATE, SQLERRM;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created_give_balance
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.give_initial_balance();
