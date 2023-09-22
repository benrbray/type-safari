{-# LANGUAGE DeriveAnyClass #-}
{-# LANGUAGE DerivingStrategies #-}
{-# LANGUAGE RecordWildCards #-}

module TypeSafari.Api.InferAbstract where

import Data.Aeson hiding (Result)
import Data.Map as Map
import GHC.Generics

import TypeSafari.Core
import TypeSafari.HindleyMilner.Syntax qualified as Stx
import TypeSafari.HindleyMilner.Parse (parse, ParseResult (..), ParseError)
import TypeSafari.HindleyMilner.Infer (SubstMV)
import TypeSafari.Pretty (Pretty(..))
import TypeSafari.HindleyMilner.Infer.Abstract (hindleyMilner, Result (..))

--------------------------------------------------------------------------------

newtype Input = Input {
    inputText :: Text
  }
  deriving stock (Show, Generic)
  deriving anyclass FromJSON

data Output = Output {
    outputType :: Maybe Text,
    outputSubst :: Maybe (Map Text Text),
    outputConstraints :: Maybe [Text],
    outputActions :: Maybe [Text],
    outputExpr :: Maybe Stx.LocatedExpr,
    outputError :: Maybe OutputError
  }
  deriving stock (Generic)
  deriving anyclass ToJSON

data OutputError
  = OutputParseError ParseError
  | OutputTypeError Text
  | OutputUnknownError Text
  deriving stock (Generic)
  deriving anyclass (ToJSON)

--------------------------------------------------------------------------------

run :: Input -> IO Output
run Input{..} = pure . fromEither $ do
  ParseResult { parsedExpr } <- mapLeft mkOutputParseError $ parse inputText
  result <- mapLeft (mkOutputTypeError parsedExpr . pretty) (hindleyMilner parsedExpr)
  pure $ mkOutput parsedExpr result

mkOutputParseError :: ParseError -> Output
mkOutputParseError err = Output {
    outputType = Nothing,
    outputExpr = Nothing,
    outputSubst = Nothing,
    outputConstraints = Nothing,
    outputActions = Nothing,
    outputError = Just $ OutputParseError err
  }

mkOutputTypeError :: Stx.LocatedExpr -> Text -> Output
mkOutputTypeError expr err = Output {
    outputType = Nothing,
    outputSubst = Nothing,
    outputActions = Nothing,
    outputConstraints = Nothing,
    outputExpr = Just expr,
    outputError = Just $ OutputTypeError err
  }

mkSubst :: SubstMV -> Map Text Text
mkSubst = Map.mapKeys pretty . Map.map pretty

mkOutput :: Stx.LocatedExpr -> Result -> Output
mkOutput e Result{..} = Output {
    outputType = Just $ pretty resultType,
    outputExpr = Just e,
    outputSubst = Just $ mkSubst resultSubst,
    outputConstraints = Just (pretty <$> resultConstrs),
    outputActions = Just $ pretty <$> resultActions,
    outputError = Nothing
  }

dispError :: Text -> Output
dispError t =
  Output {
    outputType = Nothing,
    outputExpr = Nothing,
    outputSubst = Nothing,
    outputConstraints = Nothing,
    outputActions = Nothing,
    outputError = Just $ OutputUnknownError t
  }