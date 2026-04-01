-- Remove fake users added by previous test sync (domain @leappricing.com)
DELETE FROM public.app_users WHERE email LIKE '%@leappricing.com';
