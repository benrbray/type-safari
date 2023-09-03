{-# LANGUAGE DeriveAnyClass #-}
{-# LANGUAGE DerivingStrategies #-}
{-# LANGUAGE RecordWildCards #-}

module TypeSafari.Api.InferConcrete where

import Data.Aeson
import GHC.Generics
import Prelude

import TypeSafari.Core
import TypeSafari.HindleyMilner.Syntax qualified as Stx
import TypeSafari.HindleyMilner.Parse (parse, ParseResult (..))
import TypeSafari.HindleyMilner.Infer (Type)
import TypeSafari.Pretty (Pretty(..))
import TypeSafari.HindleyMilner.Infer.Concrete (hindleyMilner)

--------------------------------------------------------------------------------

newtype Input = Input {
    inputText :: Text
  }
  deriving stock (Show, Generic)
  deriving anyclass FromJSON

data Output = Output {
    outputType :: Maybe Text,
    outputExpr :: Maybe Stx.Expr,
    outputError :: Maybe Text
  }
  deriving stock (Show, Generic)
  deriving anyclass ToJSON

--------------------------------------------------------------------------------

runHindleyMilner :: Input -> IO Output
runHindleyMilner Input{..} = pure . fromEither $ do
  ParseResult { parsedExpr } <- mapLeft mkOutputParseError $ parse inputText
  let run = hindleyMilner parsedExpr
  inferredType <- mapLeft (mkOutputTypeError parsedExpr . pretty) run
  pure $ mkOutput parsedExpr inferredType

mkOutputParseError :: Text -> Output
mkOutputParseError err = Output {
    outputType = Nothing,
    outputExpr = Nothing,
    outputError = Just err
  }

mkOutputTypeError :: Stx.Expr -> Text -> Output
mkOutputTypeError expr err = Output {
    outputType = Nothing,
    outputExpr = Just expr,
    outputError = Just err
  }

mkOutput :: Stx.Expr -> Type -> Output
mkOutput e t = Output {
    outputType = Just $ pretty t,
    outputExpr = Just e,
    outputError = Nothing
  }

dispError :: Text -> Output
dispError t =
  Output {
    outputType = Nothing,
    outputExpr = Nothing,
    outputError = Just t
  }