# NOÉ WORK BANK

La banque de la connaissance et des opportunités. Cette application web est le MVP : NOÉ Talents, NOÉ Jobs, NOÉ Business, l'inscription Clerk, la recherche, les candidatures, la messagerie, les notifications internes, les tarifs, le parrainage et l'administration.

Le schéma Postgres `workbank` est séparé des tables déjà présentes dans le projet Neon.

## Démarrage

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

For deployment, apply committed migrations with `npm run db:migrate:deploy`.

Le premier compte créé devient administrateur. Les adresses listées dans `ADMIN_EMAILS` le deviennent aussi.

Depuis l’administration, les administrateurs peuvent générer des liens d’invitation à partager. Les invitations expirent après 7 jours ; les nouveaux comptes restent en attente jusqu’à leur validation dans **Utilisateurs**.

Clerk est en clés de développement. Pour rattacher l'application à votre compte : `npx clerk auth login`.

## Paiements

Les demandes enregistrent un paiement en attente (CinetPay, Mobile Money ou carte). L'encaissement réel sera branché après validation de la passerelle. L'administration peut confirmer un paiement : l'abonnement et la commission d'un ambassadeur parrain sont alors calculés.

## Versions suivantes

Projets, marchés, academy, invest (mise en relation seulement) et intelligence économique ne sont pas simulés. Ils sont annoncés dans Modules.
